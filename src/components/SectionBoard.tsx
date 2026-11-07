import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { DailyLog, LedgerSection, TaskStatus } from '../models/types';
import { colors, fonts, typography } from '../theme';
import { formatStars } from '../utils/dates';
import {
  criticalMissPenalty,
  getTaskStatus,
  slipPenalty,
  taskValue,
} from '../utils/economy';
import { Field } from './Field';
import { PrimaryButton } from './PrimaryButton';
import { TaskToggle } from './TaskToggle';

interface SectionBoardProps {
  sections: LedgerSection[];
  daily: DailyLog;
  loading?: boolean;
  onToggleComplete: (taskId: string) => void;
  onToggleSlip: (taskId: string, current: TaskStatus) => void;
  onAddSection: (input: { title: string; sectionValue: number }) => void;
  onUpdateSection: (
    sectionId: string,
    patch: { title?: string; sectionValue?: number },
  ) => void;
  onRemoveSection: (sectionId: string) => void;
  onAddTask: (
    sectionId: string,
    input: { title: string; description: string },
  ) => void;
  onUpdateTask: (
    sectionId: string,
    taskId: string,
    patch: { title?: string; description?: string },
  ) => void;
  onRemoveTask: (sectionId: string, taskId: string) => void;
}

export function SectionBoard({
  sections,
  daily,
  loading,
  onToggleComplete,
  onToggleSlip,
  onAddSection,
  onUpdateSection,
  onRemoveSection,
  onAddTask,
  onUpdateTask,
  onRemoveTask,
}: SectionBoardProps) {
  const [manageMode, setManageMode] = useState(false);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionValue, setNewSectionValue] = useState('1.0');
  const [taskDrafts, setTaskDrafts] = useState<
    Record<string, { title: string; description: string }>
  >({});
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [editSectionValue, setEditSectionValue] = useState('1.0');
  const [editingTaskKey, setEditingTaskKey] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskDescription, setEditTaskDescription] = useState('');

  const beginEditSection = (section: LedgerSection) => {
    setEditingSectionId(section.id);
    setEditSectionTitle(section.title);
    setEditSectionValue(String(section.sectionValue));
  };

  const saveEditSection = () => {
    if (!editingSectionId) return;
    const value = Number.parseFloat(editSectionValue);
    onUpdateSection(editingSectionId, {
      title: editSectionTitle,
      sectionValue: Number.isFinite(value) ? value : 1.0,
    });
    setEditingSectionId(null);
  };

  const beginEditTask = (
    sectionId: string,
    taskId: string,
    title: string,
    description: string,
  ) => {
    setEditingTaskKey(`${sectionId}:${taskId}`);
    setEditTaskTitle(title);
    setEditTaskDescription(description);
  };

  const saveEditTask = (sectionId: string, taskId: string) => {
    onUpdateTask(sectionId, taskId, {
      title: editTaskTitle,
      description: editTaskDescription,
    });
    setEditingTaskKey(null);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Dynamic Sections</Text>
          <Text style={typography.label}>
            Task value = Section Value ÷ tasks. Slip = −50%. All-slip = extra −50%
            section.
          </Text>
        </View>
        <PrimaryButton
          label={manageMode ? 'Done' : 'Manage'}
          tone="muted"
          onPress={() => setManageMode((v) => !v)}
          style={styles.manageBtn}
        />
      </View>

      {sections.map((section) => {
        const valueEach = taskValue(section);
        const slipEach = slipPenalty(section);
        const crit = criticalMissPenalty(section);
        const allSlip =
          section.tasks.length > 0 &&
          section.tasks.every((t) => getTaskStatus(daily, t.id) === 'slip');
        const draft = taskDrafts[section.id] ?? { title: '', description: '' };

        return (
          <View
            key={section.id}
            style={[styles.sectionCard, allSlip && styles.sectionCardCrit]}
          >
            <View style={styles.sectionHeader}>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionMeta}>
                  Section Value {formatStars(section.sectionValue)} ★ ·{' '}
                  {section.tasks.length} task
                  {section.tasks.length === 1 ? '' : 's'} · each{' '}
                  {formatStars(valueEach)}
                </Text>
                {allSlip ? (
                  <Text style={styles.critNote}>
                    Critical miss active (−{formatStars(crit)} section fine)
                  </Text>
                ) : null}
              </View>
              {manageMode ? (
                <View style={styles.sectionActions}>
                  <Pressable onPress={() => beginEditSection(section)}>
                    <Text style={styles.linkCyan}>Edit</Text>
                  </Pressable>
                  <Pressable onPress={() => onRemoveSection(section.id)}>
                    <Text style={styles.linkCrimson}>Remove</Text>
                  </Pressable>
                </View>
              ) : null}
            </View>

            {editingSectionId === section.id ? (
              <View style={styles.inlineForm}>
                <Field
                  label="Section title"
                  value={editSectionTitle}
                  onChangeText={setEditSectionTitle}
                />
                <Field
                  label="Section value"
                  value={editSectionValue}
                  onChangeText={setEditSectionValue}
                  keyboardType="decimal-pad"
                />
                <PrimaryButton label="Save Section" onPress={saveEditSection} />
              </View>
            ) : null}

            {section.tasks.map((task) => {
              const status = getTaskStatus(daily, task.id);
              const editKey = `${section.id}:${task.id}`;
              if (editingTaskKey === editKey) {
                return (
                  <View key={task.id} style={styles.inlineForm}>
                    <Field
                      label="Task title"
                      value={editTaskTitle}
                      onChangeText={setEditTaskTitle}
                    />
                    <Field
                      label="Description"
                      value={editTaskDescription}
                      onChangeText={setEditTaskDescription}
                    />
                    <PrimaryButton
                      label="Save Task"
                      onPress={() => saveEditTask(section.id, task.id)}
                    />
                  </View>
                );
              }
              return (
                <TaskToggle
                  key={task.id}
                  task={task}
                  status={status}
                  taskValue={valueEach}
                  slipValue={slipEach}
                  editing={manageMode}
                  onComplete={() => onToggleComplete(task.id)}
                  onSlip={() => onToggleSlip(task.id, status)}
                  onEdit={() =>
                    beginEditTask(
                      section.id,
                      task.id,
                      task.title,
                      task.description,
                    )
                  }
                  onRemove={() => onRemoveTask(section.id, task.id)}
                />
              );
            })}

            {manageMode ? (
              <View style={styles.inlineForm}>
                <Field
                  label="New task title"
                  value={draft.title}
                  onChangeText={(title) =>
                    setTaskDrafts((prev) => ({
                      ...prev,
                      [section.id]: { ...draft, title },
                    }))
                  }
                  placeholder="e.g. Cold shower"
                />
                <Field
                  label="Description"
                  value={draft.description}
                  onChangeText={(description) =>
                    setTaskDrafts((prev) => ({
                      ...prev,
                      [section.id]: { ...draft, description },
                    }))
                  }
                  placeholder="Optional detail"
                />
                <PrimaryButton
                  label="Add Task"
                  tone="emerald"
                  loading={loading}
                  disabled={!draft.title.trim()}
                  onPress={() => {
                    onAddTask(section.id, {
                      title: draft.title,
                      description: draft.description,
                    });
                    setTaskDrafts((prev) => ({
                      ...prev,
                      [section.id]: { title: '', description: '' },
                    }));
                  }}
                />
              </View>
            ) : null}
          </View>
        );
      })}

      {manageMode ? (
        <View style={styles.addSection}>
          <Text style={styles.heading}>Add Section</Text>
          <Field
            label="Title"
            value={newSectionTitle}
            onChangeText={setNewSectionTitle}
            placeholder="e.g. Evening Stack"
          />
          <Field
            label="Section value (default 1.0)"
            value={newSectionValue}
            onChangeText={setNewSectionValue}
            keyboardType="decimal-pad"
          />
          <PrimaryButton
            label="Create Section"
            tone="cyan"
            loading={loading}
            disabled={!newSectionTitle.trim()}
            onPress={() => {
              const value = Number.parseFloat(newSectionValue);
              onAddSection({
                title: newSectionTitle,
                sectionValue: Number.isFinite(value) && value > 0 ? value : 1.0,
              });
              setNewSectionTitle('');
              setNewSectionValue('1.0');
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  header: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  heading: {
    fontFamily: fonts.bodyBold,
    color: colors.textPrimary,
    fontSize: 18,
  },
  manageBtn: { minWidth: 88 },
  sectionCard: {
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundElevated,
  },
  sectionCardCrit: {
    borderColor: colors.crimson,
  },
  sectionHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontFamily: fonts.bodyBold,
    color: colors.amber,
    fontSize: 16,
  },
  sectionMeta: {
    fontFamily: fonts.body,
    color: colors.textSecondary,
    fontSize: 13,
  },
  critNote: {
    fontFamily: fonts.bodyMedium,
    color: colors.crimson,
    fontSize: 12,
    marginTop: 2,
  },
  sectionActions: { gap: 8, alignItems: 'flex-end' },
  linkCyan: {
    fontFamily: fonts.bodyMedium,
    color: colors.cyan,
    fontSize: 13,
  },
  linkCrimson: {
    fontFamily: fonts.bodyMedium,
    color: colors.crimson,
    fontSize: 13,
  },
  inlineForm: {
    gap: 10,
    paddingTop: 4,
  },
  addSection: {
    gap: 10,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    backgroundColor: colors.backgroundMuted,
  },
});
