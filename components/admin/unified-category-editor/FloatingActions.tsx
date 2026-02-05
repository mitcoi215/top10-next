'use client';

interface FloatingActionsProps {
  onSave: () => void;
  isSaving: boolean;
  isDirty: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
}

export default function FloatingActions({
  onSave,
  isSaving,
  isDirty,
  saveStatus,
}: FloatingActionsProps) {
  return (
    <div className="floating-actions">
      <button
        className={`btn-save ${isDirty ? 'has-changes' : ''}`}
        onClick={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <span className="spinner">⏳</span>
            Đang lưu...
          </>
        ) : saveStatus === 'saved' ? (
          <>
            <span>✓</span>
            Đã lưu
          </>
        ) : (
          <>
            <span>💾</span>
            Lưu danh mục
          </>
        )}
      </button>
    </div>
  );
}
