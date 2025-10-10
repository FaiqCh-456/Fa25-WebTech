let localPosts = [];

function fetchPosts() {
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    dataType: "json",
    success: function (data) {
      localPosts = data.slice(0, 10);
      renderPosts();
    },
    error: function (error) {
      console.error("Error fetching posts:", error);
    },
  });
}

function renderPosts() {
  const postsList = $("#postsList");
  postsList.empty();

  $.each(localPosts, function (_, post) {
    postsList.append(`
      <div class="mb-3" data-id="${post.id}">
        <h3>${post.title}</h3>
        <div>${post.body}</div>
        <div>
          <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${post.id}">Edit</button>
          <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${post.id}">Delete</button>
        </div>
      </div>
      <hr />
    `);
  });
}

// Delete post
function deletePost() {
  const postId = $(this).attr("data-id");

  $.ajax({
    url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
    method: "DELETE",
    complete: function () {
      // Update local array
      localPosts = localPosts.filter(p => p.id != postId);
      renderPosts();
    }
  });
}

function savePost(e) {
  e.preventDefault();

  const postId = $("#createBtn").attr("data-id");
  const title = $("#createTitle").val();
  const body = $("#createContent").val();

  if (postId) {
    $.ajax({
      url: `https://jsonplaceholder.typicode.com/posts/${postId}`,
      method: "PUT",
      data: { title, body },
      complete: function () {
        const idx = localPosts.findIndex(p => p.id == postId);
        if (idx >= 0) {
          localPosts[idx].title = title;
          localPosts[idx].body = body;
        }
        renderPosts();
        resetForm();
      }
    });
  } else {
    // Create
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      data: { title, body },
      complete: function () {
        const newId = localPosts.length ? Math.max(...localPosts.map(p => p.id)) + 1 : 1;
        localPosts.unshift({ id: newId, title, body });
        renderPosts();
        resetForm();
      }
    });
  }
}

function editPost(e) {
  e.preventDefault();
  const postId = $(this).attr("data-id");
  const post = localPosts.find(p => p.id == postId);
  if (!post) return;

  $("#createTitle").val(post.title);
  $("#createContent").val(post.body);
  $("#createBtn").html("Update").attr("data-id", post.id);
  $("#clearBtn").show();
}

function resetForm() {
  $("#createTitle").val("");
  $("#createContent").val("");
  $("#createBtn").removeAttr("data-id").html("Create");
  $("#clearBtn").hide();
}

$(document).ready(function () {
  fetchPosts();

  $(document).on("click", ".btn-del", deletePost);
  $(document).on("click", ".btn-edit", editPost);
  $("#createForm").submit(savePost);
  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    resetForm();
  });
});
