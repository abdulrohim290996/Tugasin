import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#4F46E5',
  success: '#10B981',
  warning: '#F59E0B',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
};

const SummaryCard = ({ icon, label, value, color }) => (
  <View style={[styles.card, { borderTopColor: color }]}>
    <View style={[styles.iconWrap, { backgroundColor: color + '20' }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const TaskSummary = ({ summary }) => (
  <View style={styles.row}>
    <SummaryCard icon="list-outline" label="Total Tugas" value={summary.total} color={COLORS.primary} />
    <SummaryCard icon="time-outline" label="Belum Dikerjakan" value={summary.belum} color={COLORS.warning} />
    <SummaryCard icon="checkmark-done-outline" label="Selesai" value={summary.selesai} color={COLORS.success} />
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderTopWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  label: {
    fontSize: 10,
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '500',
  },
});

export default TaskSummary;
