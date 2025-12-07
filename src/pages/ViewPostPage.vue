<template>
  <div class="view-post-container">
    <div v-if="loading">Loading post...</div>

    <div v-else-if="post" class="post-card">
      <h2 class="title">{{ post.title }}</h2>
      <p class="author">by {{ post.author }}</p>

      <!-- Content -->
      <div class="content-box">
        <p>{{ post.content }}</p>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="actions">
        <button class="edit" @click="editing = !editing" :disabled="!canEdit">
          ✏️ Edit
        </button>
        <button class="delete" @click="deletePost" :disabled="!canDelete">
          🗑 Delete
        </button>
      </div>

      <!-- EDIT FORM -->
      <div v-if="editing" class="edit-box">
        <input v-model="editTitle" placeholder="Edit title" />
        <textarea v-model="editContent" placeholder="Edit content"></textarea>
        <button @click="updatePost" class="save">💾 Save</button>
      </div>

      <!-- COMMENTS -->
      <div class="comments-box">
        <h3>💬 Comments</h3>

        <div v-if="!post.comments.length" class="no-comments">
          No comments yet
        </div>

        <div class="comment" v-for="c in post.comments" :key="c._id">
          <p>
            <strong>{{ c.author }}</strong
            >: {{ c.comment }}
          </p>
          <button class="del-comment" @click="deleteComment(c._id)">❌</button>
        </div>
      </div>

      <!-- ADD COMMENT -->
      <div class="add-comment">
        <textarea
          v-model="newComment"
          placeholder="Write a comment..."
        ></textarea>
        <button @click="addComment">➕ Add Comment</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api.js";
import { useGlobalStore } from "../stores/global.js";
import { computed } from "vue";
const store = useGlobalStore();

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const post = ref(null);
const loading = ref(true);

const editing = ref(false);
const editTitle = ref("");
const editContent = ref("");

const newComment = ref("");

/* LOAD SINGLE BLOG */
async function loadPost() {
  try {
    const res = await api.get(`/blog/viewBlogSpecific/${id}`);
    post.value = res.data;

    editTitle.value = post.value.title;
    editContent.value = post.value.content;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
}

/* UPDATE BLOG */
async function updatePost() {
  try {
    await api.patch(`/blog/updateBlog/${id}`, {
      title: editTitle.value,
      content: editContent.value,
    });
    editing.value = false;
    await loadPost();
  } catch (err) {
    console.error(err);
  }
}

/* DELETE BLOG */
async function deletePost() {
  try {
    await api.delete(`/blog/deleteBlog/${id}`);
    router.push({ path: "/" });
  } catch (err) {
    console.error(err);
  }
}

/* ADD COMMENT */
async function addComment() {
  if (!newComment.value) return;

  try {
    await api.post(`/blog/addComment/${id}`, {
      comment: newComment.value,
    });
    newComment.value = "";
    await loadPost();
  } catch (err) {
    console.error(err);
  }
}

/* DELETE COMMENT */
async function deleteComment(commentId) {
  try {
    await api.delete(`/blog/${id}/comments/${commentId}`);
    await loadPost();
  } catch (err) {
    console.error(err);
  }
}

const canEdit = computed(() => {
  if (!post.value || !store.user) return false;
  return post.value.author === store.user.userName;
});

const canDelete = computed(() => {
  if (!post.value || !store.user) return false;

  return (
    post.value.author === store.user.userName || store.user.isAdmin === true
  );
});

onMounted(loadPost);
</script>

<style scoped>
.view-post-container {
  padding: 30px;
  display: flex;
  justify-content: center;
}

.post-card {
  width: 100%;
  max-width: 700px;
  background: white;
  padding: 25px;
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.author {
  color: #777;
  margin-bottom: 15px;
}

.content-box {
  background: #f8f6ff;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
}

.actions button {
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.edit {
  background: #6e29d3;
  color: white;
}

.delete {
  background: #ff4444;
  color: white;
}

/* EDIT FORM */
.edit-box {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-box input,
.edit-box textarea {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.save {
  background: #28a745;
  color: white;
  padding: 10px;
  border-radius: 10px;
  border: none;
}

/* COMMENTS */
.comments-box {
  margin-top: 15px;
}

.comment {
  background: #fafafa;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.del-comment {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

/* ADD COMMENT */
.add-comment {
  margin-top: 15px;
}

.add-comment textarea {
  width: 100%;
  height: 90px;
  border-radius: 10px;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
}

.add-comment button {
  background: #6e29d3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .post-card {
    padding: 18px;
  }
}
</style>
