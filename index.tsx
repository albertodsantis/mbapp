import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

type KpiCardProps = {
  title: string;
  amount: string;
  icon: keyof typeof FontAwesome.glyphMap;
  accent: string;
  onPress?: () => void;
};

const KpiCard = ({ title, amount, icon, accent, onPress }: KpiCardProps) => {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.kpiCard} onPress={onPress}>
      <View style={styles.kpiHeader}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <View style={[styles.kpiIconContainer, { backgroundColor: `${accent}22` }]}>
          <FontAwesome name={icon} size={14} color={accent} />
        </View>
      </View>
      <Text style={styles.kpiAmount}>{amount}</Text>
      <Text style={[styles.kpiMeta, { color: accent }]}>Ver detalle</Text>
    </TouchableOpacity>
  );
};

export default function IndexScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>Hola, Valentina</Text>
            <Text style={styles.subtitle}>Resumen mensual</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} activeOpacity={0.85}>
            <FontAwesome name="user" size={20} color="#10b981" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.balanceCard} activeOpacity={0.92}>
          <Text style={styles.balanceLabel}>BALANCE NETO</Text>
          <Text style={styles.balanceAmount}>$2,845.40</Text>
          <View style={styles.balanceActionRow}>
            <Text style={styles.balanceActionText}>Ver reporte detallado</Text>
            <FontAwesome name="line-chart" size={12} color="#d1fae5" />
          </View>
        </TouchableOpacity>

        <View style={styles.grid}>
          <KpiCard title="Ingresos" amount="$4,150.00" icon="arrow-up" accent="#10b981" />
          <KpiCard title="Gastos Fijos" amount="$850.00" icon="credit-card" accent="#10b981" />
          <KpiCard title="Ahorro" amount="$1,000.00" icon="bank" accent="#10b981" />
          <KpiCard title="Gastos Variables" amount="$454.60" icon="arrow-down" accent="#10b981" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#020617', // Slate 950
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 28,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  greeting: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a', // Slate 900
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  balanceCard: {
    backgroundColor: '#10b981', // Emerald 500
    borderRadius: 32,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  balanceLabel: {
    color: '#d1fae5',
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: '800',
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: '900',
    marginTop: 6,
  },
  balanceActionRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceActionText: {
    color: '#d1fae5',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  kpiCard: {
    width: '48.2%',
    minHeight: 126,
    borderRadius: 20,
    padding: 14,
    backgroundColor: '#0f172a', // Slate 900
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kpiTitle: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
    paddingRight: 8,
  },
  kpiIconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiAmount: {
    marginTop: 14,
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  kpiMeta: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: '700',
  },
});
