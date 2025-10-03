function fetchPosts() {
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts",
    method: "GET",
    dataType: "json",
    success: renderPosts,
    error: function (error) {
      console.error("Error fetching posts:", error);
    },
  });
}

function renderPosts(data) {
  var postsList = $("#postsList");
  postsList.empty();

  $.each(data, function (index, post) {
    postsList.append(
      `<div class="mb-3">
            <h3>${post.title}</h3>
            <div>${post.body}</div>
            <div>
                <button class="btn btn-info btn-sm mr-2 btn-edit" data-id="${post.id}">Edit</button>
                <button class="btn btn-danger btn-sm mr-2 btn-del" data-id="${post.id}">Delete</button>
            </div>
        </div>
        <hr />`
    );
  });
}

// Delete post
function deletePost() {
  let postId = $(this).attr("data-id");
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + postId,
    method: "DELETE",
    success: function () {
      fetchPosts();
    },
    error: function (error) {
      console.error("Error deleting post:", error);
    },
  });
}

// Create / Update post
function savePost(event) {
  event.preventDefault();
  let postId = $("#createBtn").attr("data-id");
  var title = $("#createTitle").val();
  var body = $("#createContent").val();

  if (postId) {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts/" + postId,
      method: "PUT",
      data: { title, body },
      success: function () {
        fetchPosts();
      },
      error: function (error) {
        console.error("Error updating post:", error);
      },
    });
  } else {
    $.ajax({
      url: "https://jsonplaceholder.typicode.com/posts",
      method: "POST",
      data: { title, body },
      success: function () {
        fetchPosts();
      },
      error: function (error) {
        console.error("Error creating post:", error);
      },
    });
  }
}

// Edit post
function editPost(event) {
  event.preventDefault();
  let postId = $(this).attr("data-id");
  $.ajax({
    url: "https://jsonplaceholder.typicode.com/posts/" + postId,
    method: "GET",
    success: function (data) {
      $("#clearBtn").show();
      $("#createTitle").val(data.title);
      $("#createContent").val(data.body);
      $("#createBtn").html("Update");
      $("#createBtn").attr("data-id", data.id);
    },
    error: function (error) {
      console.error("Error fetching post:", error);
    },
  });
}

$(document).ready(function () {
  fetchPosts();
  $(document).on("click", ".btn-del", deletePost);
  $(document).on("click", ".btn-edit", editPost);
  $("#createForm").submit(savePost);

  $("#clearBtn").on("click", function (e) {
    e.preventDefault();
    $("#clearBtn").hide();
    $("#createBtn").removeAttr("data-id");
    $("#createBtn").html("Create");
    $("#createTitle").val("");
    $("#createContent").val("");
  });
});
