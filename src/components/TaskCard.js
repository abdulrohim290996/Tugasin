import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#4F46E5',
  success: '#10B981',
  danger: '#EF4444',
  warning: '#F59E0B',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
};

const TaskCard = ({ task, onToggle, onDelete }) => {
  const isDone = task.status === 'Selesai';
  const isOverdue = !isDone && new Date(task.deadline) < new Date();

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      <View style={styles.header}>
        <View style={[styles.badge, isDone ? styles.badgeDone : isOverdue ? styles.badgeOverdue : styles.badgePending]}>
          <Ionicons
            name={isDone ? 'checkmark-circle' : isOverdue ? 'alert-circle' : 'time-outline'}
            size={12}
            color="#fff"
          />
          <Text style={styles.badgeText}>
            {isDone ? 'Selesai' : isOverdue ? 'Terlambat' : 'Belum Dikerjakan'}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onToggle(task.id)} style={styles.actionBtn}>
            <Ionicons
              name={isDone ? 'refresh-circle-outline' : 'checkmark-circle-outline'}
              size={22}
              color={isDone ? COLORS.muted : COLORS.success}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionBtn}>
            <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.taskName, isDone && styles.taskNameDone]} numberOfLines={2}>
        {task.nama_tugas}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons name="book-outline" size={13} color={COLORS.primary} />
        <Text style={styles.metaText}>{task.mata_kuliah}</Text>
      </View>

      {task.deskripsi ? (
        <Text style={styles.desc} numberOfLines={2}>{task.deskripsi}</Text>
      ) : null}

      <View style={styles.footer}>
        <Ionicons name="calendar-outline" size={13} color={isOverdue && !isDone ? COLORS.danger : COLORS.muted} />
        <Text style={[styles.deadline, isOverdue && !isDone && styles.deadlineOverdue]}>
          {new Date(task.deadline).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardDone: {
    borderLeftColor: COLORS.success,
    opacity: 0.85,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  badgePending: { backgroundColor: COLORS.warning },
  badgeDone: { backgroundColor: COLORS.success },
  badgeOverdue: { backgroundColor: COLORS.danger },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 4 },
  actionBtn: { padding: 4 },
  taskName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  taskNameDone: {
    textDecorationLine: 'line-through',
    color: COLORS.muted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  metaText: { fontSize: 13, color: COLORS.primary, fontWeight: '500' },
  desc: { fontSize: 13, color: COLORS.muted, marginBottom: 8, lineHeight: 18 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deadline: { fontSize: 12, color: COLORS.muted },
  deadlineOverdue: { color: COLORS.danger, fontWeight: '600' },
});

export default TaskCard;
