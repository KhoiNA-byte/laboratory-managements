// src/modules/testorder/CommentsPage.tsx
import React, { useEffect, useState } from "react";
import { XMarkIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { CommentItem } from "../../store/slices/testResultsSlice";

const structuredCloneSafe = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

/**
 * Comments component
 * - Không dùng localStorage nữa.
 * - Nếu muốn dùng tên user thực, truyền prop `currentUserName` từ parent (ví dụ lấy từ redux).
 */
export default function Comments({
  orderNumber,
  initialComments,
  onClose,
  onChangeComments,
  currentUserName,
}: {
  orderNumber: string;
  initialComments: CommentItem[] | undefined;
  onClose: () => void;
  onChangeComments: (comments: CommentItem[]) => void;
  currentUserName?: string; // <-- optional, nếu không truyền sẽ dùng "Admin User"
}) {
  const [comments, setComments] = useState<CommentItem[]>(
    structuredCloneSafe(initialComments ?? [])
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMenuFor, setActionMenuFor] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  useEffect(() => {
    setComments(structuredCloneSafe(initialComments ?? []));
  }, [initialComments]);

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "";

  const startEdit = (id: string) => {
    const c = comments.find((x) => x.id === id);
    if (!c) return;
    setEditingId(id);
    setEditingText(c.text);
    setActionMenuFor(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const saveEdit = (id: string) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
      alert("Comment cannot be empty");
      return;
    }
    const updated = comments.map((c) =>
      c.id === id ? { ...c, text: trimmed } : c
    );
    setComments(updated);
    onChangeComments(updated); // parent sẽ persist
    setEditingId(null);
    setEditingText("");
  };

  const startDelete = (id: string) => {
    setDeletingId(id);
    setActionMenuFor(null);
  };
  const cancelDelete = () => setDeletingId(null);
  const confirmDelete = (id: string) => {
    const updated = comments.filter((c) => c.id !== id);
    setComments(updated);
    onChangeComments(updated);
    setDeletingId(null);
  };

  const genId = () => `c${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // LẤY TÊN NGƯỜI DÙNG: ưu tiên prop currentUserName, fallback "Admin User"
  const getCurrentUserNameSafe = () => {
    if (typeof currentUserName === "string" && currentUserName.trim())
      return currentUserName;
    return "Admin User";
  };

  const addComment = () => {
    const text = newCommentText.trim();
    if (!text) return;
    const author = getCurrentUserNameSafe();
    const initials = author
      .split(" ")
      .map((s) => s[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
    const newItem: CommentItem = {
      id: genId(),
      author,
      authorInitials: initials,
      role: "",
      text,
      createdAt: new Date().toISOString(),
    };
    const updated = [...comments, newItem];
    setComments(updated);
    onChangeComments(updated);
    setNewCommentText("");
  };

  const commentList = comments.slice().reverse(); // newest first

  return (
    /* <<< SỬ DỤNG z-INDEX ARBITRARY ĐỂ CHẮC CHẮN NẰM TRÊN MODAL CHÍNH >>> */
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
      {/* overlay: thấp hơn nội dung modal nhưng cao hơn backdrop modal chính */}
      <div
        className="absolute inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-auto overflow-hidden z-[10000]">
        {/* header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
              <div className="text-sm text-gray-500">
                TestResultID: <span className="font-medium">{orderNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-500 text-right">
              <div>Total comments</div>
              <div className="text-lg font-semibold text-gray-900">
                {comments.length}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100"
              title="Close"
            >
              <XMarkIcon className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* body */}
        <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
          {commentList.length === 0 ? (
            <div className="text-center text-sm text-gray-500 py-12">
              No comments yet.
            </div>
          ) : (
            <ul className="space-y-4">
              {commentList.map((c) => (
                <li key={c.id} className="bg-gray-50 rounded-lg p-4 relative">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
                        {c.authorInitials ??
                          c.author
                            .split(" ")
                            .map((s) => s[0] || "")
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {c.author}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(c.createdAt)}
                          </div>
                        </div>

                        <div className="relative">
                          <button
                            onClick={() =>
                              setActionMenuFor(
                                actionMenuFor === c.id ? null : c.id
                              )
                            }
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <span className="text-gray-500">⋯</span>
                          </button>

                          {actionMenuFor === c.id && (
                            <div className="absolute right-0 mt-2 w-36 bg-white border rounded-md shadow z-10">
                              <button
                                onClick={() => startEdit(c.id)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                              >
                                Modify
                              </button>
                              <button
                                onClick={() => startDelete(c.id)}
                                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 text-sm text-gray-700 space-y-2">
                        {editingId === c.id ? (
                          <>
                            <textarea
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="w-full border rounded p-2 text-sm"
                              rows={3}
                            />
                            <div className="flex items-center gap-3 mt-2">
                              <button
                                onClick={() => saveEdit(c.id)}
                                className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-3 py-1 rounded border text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </>
                        ) : deletingId === c.id ? (
                          <div className="flex items-center gap-3">
                            <div className="text-sm text-gray-700">
                              Are you sure?
                            </div>
                            <button
                              onClick={() => confirmDelete(c.id)}
                              className="px-3 py-1 rounded bg-red-600 text-white text-sm"
                            >
                              Delete
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="px-3 py-1 rounded border text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap break-words break-all text-sm text-gray-700">
                            {c.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* footer - add new */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="text-sm text-gray-600 mb-2">Add comment</div>
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Write a note for this test result..."
            className="w-full border rounded p-3 text-sm min-h-[80px] resize-y"
          />
          <div className="flex items-center justify-end gap-3 mt-3">
            <button
              onClick={() => setNewCommentText("")}
              className="px-4 py-2 rounded border text-sm"
            >
              Cancel
            </button>
            <button
              onClick={addComment}
              className="px-4 py-2 rounded bg-blue-600 text-white text-sm"
            >
              Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
