import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, Animated, Dimensions, KeyboardAvoidingView, Platform, ScrollView,
  StatusBar as RNStatusBar
} from 'react-native';

const { width, height } = Dimensions.get('window');

// --- 1. CHILD COMPONENT: Neon Glass Profile Card (Konsep PROPS) ---
const NeonPassCard = ({ name, level }) => {
  // Animasi warna status berdasarkan level (Hanya Visual, tidak pakai state tambahan)
  const isElite = level > 50;
  const mainColor = isElite ? '#ff00ff' : '#00ffff'; // Magenta jika Elite, Cyan jika Scout

  return (
    <View style={styles.glassCard}>
      {/* Efek Kilauan Kaca Transparan */}
      <View style={styles.cardGlowOverlay} />
      
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>ID: OPERATIVE_NODE</Text>
        <View style={[styles.statusIndicator, { backgroundColor: mainColor }]} />
      </View>

      <Text style={styles.label}>OPERATIVE NAME</Text>
      <Text style={styles.heroName}>{name || 'AWAITING AUTH...'}</Text>
      
      <View style={styles.statsRow}>
        <View>
          <Text style={styles.label}>ACCESS_LEVEL</Text>
          <Text style={[styles.levelNum, { color: mainColor }]}>{level}</Text>
        </View>
        <View style={[styles.rankBadge, { borderColor: mainColor }]}>
          <Text style={[styles.rankText, { color: mainColor }]}>{isElite ? 'ELITE' : 'SCOUT'}</Text>
        </View>
      </View>
    </View>
  );
};

// --- 2. MAIN COMPONENT ---
export default function Pertemuan4Colorful() {
  // States (Konsep Ingatan)
  const [inputName, setInputName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [powerLevel, setPowerLevel] = useState(10);
  const [xp, setXp] = useState(0); // State tambahan untuk kalkulasi XP standar materi

  // Ref untuk animasi transisi halus saat nama diupdate
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Fungsi Event Handling dengan Animasi
  const handleActivation = () => {
    if (inputName.trim().length < 3) {
      Alert.alert("Initialization Failed", "Codename hero minimal harus 3 karakter!");
      return;
    }

    // Animasi transisi halus (Fade Out -> Fade In)
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.2, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true })
    ]).start();

    setDisplayName(inputName);
    setInputName(''); // Reset input
  };

  const gainExperience = () => {
    // Menambah XP dan level secara proporsional
    setXp(prev => prev + 25);
    setPowerLevel(prev => prev + Math.floor((xp + 25) / 100)); // Level naik tiap 100 XP
  };

  return (
    <View style={styles.mainContainer}>
      {/* --- COLORFUL BACKGROUND INTERFACE (Zero Dependency Trick) --- */}
      <View style={styles.bgContainer}>
        {/* Lingkaran Warna-warni Tumpuk dengan Opacity Rendah */}
        <View style={[styles.colorOrb, { backgroundColor: '#00ffff', top: -height * 0.2, left: -width * 0.2 }]} />
        <View style={[styles.colorOrb, { backgroundColor: '#ff00ff', bottom: -height * 0.1, right: -width * 0.1 }]} />
        <View style={[styles.colorOrb, { backgroundColor: '#ffff00', top: height * 0.4, left: width * 0.3 }]} />
        {/* Overlay Gelap Tipis agar Teks Tetap Terbaca */}
        <View style={styles.darkOverlay} />
      </View>

      <RNStatusBar barStyle="light-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <Text style={styles.appTitle}> THE MAGIC DASHBOARD </Text>
          <Text style={styles.appSubtitle}>State and Props</Text>

          {/* Menerapkan PROPS ke Child dengan Animasi Fade In */}
          <Animated.View style={{ width: '100%', opacity: fadeAnim }}>
            <NeonPassCard 
              name={displayName} 
              level={powerLevel} 
            />
          </Animated.View>

          <View style={styles.authSection}>
            <Text style={styles.sectionTitle}>IDENTITY PORTAL</Text>
            
            {/* HANDLING TEXT INPUT */}
            <TextInput
              style={styles.neonInput}
              placeholder="Enter Hero Codename..."
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={inputName}
              onChangeText={setInputName}
              maxLength={15}
            />

            <View style={styles.buttonGroup}>
              {/* EVENT HANDLING (Button) */}
              <TouchableOpacity style={styles.confirmBtn} onPress={handleActivation}>
                <Text style={styles.btnTextBold}>ACTIVATE</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.xpBtn, { opacity: displayName ? 1 : 0.5 }]} 
                onPress={gainExperience}
                disabled={!displayName} // Tombol mati jika belum login
              >
                <Text style={styles.btnTextBold}>+XP</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.materiInfo}>State: inputName, displayName, powerLevel, xp • Props: NeonPassCard</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// --- 3. CREATIVE & COLORFUL STYLES (Neon Glass & Fusion UI) ---
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#000', // Dasar hitam agar warna neon menyala
  },
  // Colorful Background Trick Styles
  bgContainer: {
    ...StyleSheet.absoluteFillObject, // Tumpuk di paling bawah
    overflow: 'hidden',
  },
  colorOrb: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    opacity: 0.15, // Kunci colorful lembut: Opacity rendah
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)', // Gelap tipis agar teks kontras
  },
  scrollContent: {
    padding: 25,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  appTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 4,
  },
  appSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 10,
    marginBottom: 45,
    letterSpacing: 1,
  },
  // Neon Glass Card Styles
  glassCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.04)', // Transparansi kaca super tipis
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)', // Border kaca tipis
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGlowOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  cardType: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    shadowColor: '#fff', shadowOpacity: 0.8, shadowRadius: 10, // Efek glow putih standar
  },
  label: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 5,
  },
  heroName: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
    marginBottom: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  levelNum: {
    fontSize: 45,
    fontWeight: '900',
    lineHeight: 45,
    textShadowColor: 'rgba(255, 255, 255, 0.3)', textShadowRadius: 10, // Efek glow warna
  },
  rankBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 2,
  },
  rankText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  // Interaction Styles
  authSection: {
    width: '100%',
    marginTop: 50,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 3,
    marginBottom: 15,
    marginLeft: 5,
  },
  neonInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Gelap transparan
    borderRadius: 18,
    padding: 20,
    color: '#fff',
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#38bdf8', // Neon Cyan
    marginBottom: 20,
    shadowColor: '#38bdf8', shadowOpacity: 0.3, shadowRadius: 10, // Efek glow input
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmBtn: {
    backgroundColor: '#ff00ff', // Neon Magenta
    padding: 20,
    borderRadius: 18,
    width: '68%',
    alignItems: 'center',
    shadowColor: '#ff00ff', shadowOpacity: 0.5, shadowRadius: 15, // Efek glow tombol
  },
  xpBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 18,
    width: '28%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  btnTextBold: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 1.5,
  },
  materiInfo: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 9,
    marginTop: 50,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
