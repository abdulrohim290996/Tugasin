import React, { useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../hooks/useTasks';
import TaskCard from './TaskCard';
import TaskSummary from './TaskSummary';
import AddTaskModal from './AddTaskModal';

const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
  danger: '#EF4444',
};

const HomeScreen = () => {
  const {
    filteredTasks, search, setSearch, summary, loading,
    addTask, deleteTask, toggleStatus, resetTasks, nameInputRef,
  } = useTasks();

  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState('Semua');

  const filters = ['Semua', 'Belum Dikerjakan', 'Selesai'];

  const displayedTasks = filter === 'Semua'
    ? filteredTasks
    : filteredTasks.filter((t) => t.status === filter);

  const handleDelete = (id) => {
    Alert.alert('Hapus Tugas', 'Yakin ingin menghapus tugas ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: () => deleteTask(id) },
    ]);
  };

  const handleReset = () => {
    Alert.alert('Reset Semua Tugas', 'Semua tugas akan dihapus dan dikembalikan ke data awal.', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetTasks },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat tugas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      <FlatList
        data={displayedTasks}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Halo, Mahasiswa! 👋</Text>
                <Text style={styles.subtitle}>Kelola tugasmu dengan mudah</Text>
              </View>
              <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
                <Ionicons name="refresh-outline" size={20} color={COLORS.muted} />
              </TouchableOpacity>
            </View>

            {/* Summary */}
            <TaskSummary summary={summary} />

            {/* Search */}
            <View style={styles.searchWrap}>
              <Ionicons name="search-outline" size={18} color={COLORS.muted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Cari tugas atau mata kuliah..."
                placeholderTextColor={COLORS.muted}
                value={search}
                onChangeText={setSearch}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                  <Ionicons name="close-circle" size={18} color={COLORS.muted} />
                </TouchableOpacity>
              )}
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterRow}>
              {filters.map((f) => (
                <TouchableOpacity
                  key={f}
                  style={[styles.filterTab, filter === f && styles.filterTabActive]}
                  onPress={() => setFilter(f)}
                >
                  <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>
              {displayedTasks.length} Tugas {filter !== 'Semua' ? filter : ''}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TaskCard task={item} onToggle={toggleStatus} onDelete={handleDelete} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Ionicons name="clipboard-outline" size={56} color={COLORS.border} />
            <Text style={styles.emptyText}>Tidak ada tugas ditemukan</Text>
            <Text style={styles.emptySubText}>
              {search ? 'Coba kata kunci lain' : 'Tambahkan tugas baru'}
            </Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addTask}
        nameInputRef={nameInputRef}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
  loadingText: { marginTop: 12, color: COLORS.muted, fontSize: 14 },
  list: { padding: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginTop: 8,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  resetBtn: {
    padding: 8,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 8,
  },
  searchIcon: { marginRight: 2 },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: 12, color: COLORS.muted, fontWeight: '600' },
  filterTextActive: { color: '#fff' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: COLORS.muted, marginBottom: 10 },
  emptyWrap: { alignItems: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.muted, marginTop: 12 },
  emptySubText: { fontSize: 13, color: COLORS.border, marginTop: 4 },
  fab: {
    position: 'absolute',
    bottom: 28,
    right: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default HomeScreen;
