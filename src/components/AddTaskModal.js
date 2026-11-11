import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Modal, ScrollView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  primary: '#4F46E5',
  primaryLight: '#EEF2FF',
  success: '#10B981',
  danger: '#EF4444',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  text: '#1E293B',
  muted: '#64748B',
  border: '#E2E8F0',
};

const AddTaskModal = ({ visible, onClose, onAdd, nameInputRef }) => {
  const [form, setForm] = useState({
    nama_tugas: '', mata_kuliah: '', deskripsi: '', deadline: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.nama_tugas.trim()) e.nama_tugas = 'Nama tugas wajib diisi';
    if (!form.mata_kuliah.trim()) e.mata_kuliah = 'Mata kuliah wajib diisi';
    if (!form.deadline.trim()) e.deadline = 'Deadline wajib diisi';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.deadline)) e.deadline = 'Format: YYYY-MM-DD';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onAdd(form);
    setForm({ nama_tugas: '', mata_kuliah: '', deskripsi: '', deadline: '' });
    setErrors({});
    onClose();
  };

  const Field = ({ label, field, placeholder, multiline }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={field === 'nama_tugas' ? nameInputRef : null}
        style={[styles.input, multiline && styles.inputMulti, errors[field] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor={COLORS.muted}
        value={form[field]}
        onChangeText={(v) => setForm((p) => ({ ...p, [field]: v }))}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
      {errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Tambah Tugas Baru</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Field label="Nama Tugas *" field="nama_tugas" placeholder="Contoh: Laporan Praktikum" />
            <Field label="Mata Kuliah *" field="mata_kuliah" placeholder="Contoh: Basis Data" />
            <Field label="Deskripsi" field="deskripsi" placeholder="Deskripsi tugas..." multiline />
            <Field label="Deadline * (YYYY-MM-DD)" field="deadline" placeholder="2025-08-01" />
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" />
              <Text style={styles.submitText}>Tambahkan Tugas</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sheetTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  closeBtn: { padding: 4 },
  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: COLORS.text, marginBottom: 6 },
  input: {
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.bg,
  },
  inputMulti: { height: 80, textAlignVertical: 'top' },
  inputError: { borderColor: COLORS.danger },
  errorText: { fontSize: 11, color: COLORS.danger, marginTop: 4 },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

export default AddTaskModal;
