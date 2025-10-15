$(document).ready(function() {

  var navbarPath;
  var currentPath = window.location.pathname;
  var isInPagesFolder = currentPath.includes('/pages/');
  
  if (isInPagesFolder) {
    navbarPath = '../components/navbar/navbar.html';
  } else {
    navbarPath = './components/navbar/navbar.html';
  }
  
  $('#navbar-placeholder').load(navbarPath, function(response, status, xhr) {
    if (status == "error") {
      console.log("Error loading navbar: " + xhr.status + " " + xhr.statusText);
      console.log("Tried to load from: " + navbarPath);
    } else {
      console.log("Navbar loaded successfully from: " + navbarPath);
      fixNavbarPaths();
      initializeModals();
      setActiveNavLink();
    }
  });
});

function fixNavbarPaths() {
  var currentPath = window.location.pathname;
  var isInPagesFolder = currentPath.includes('/pages/');
  
  if (isInPagesFolder) {
    console.log("In pages folder - using relative paths");
  } else {
    console.log("In root folder - adjusting paths");
    
    $('#brandLink').attr('href', './index.html');
    
    $('.nav-link').each(function() {
      var rootPath = $(this).attr('data-root');
      if (rootPath) {
        $(this).attr('href', './' + rootPath);
      }
    });
  }
}

function initializeModals() {
  $("#loginLink").click(function(e) {
    e.preventDefault();
    $("#loginBackdrop").addClass("show");
    $("#loginModal").addClass("show");
  });

  $("#closeLogin, #loginBackdrop").click(function() {
    $("#loginBackdrop").removeClass("show");
    $("#loginModal").removeClass("show");
  });

  $("#showSignup").click(function() {
    $("#loginBackdrop").removeClass("show");
    $("#loginModal").removeClass("show");
    $("#signupBackdrop").addClass("show");
    $("#signupModal").addClass("show");
  });

  $("#closeSignup, #signupBackdrop").click(function() {
    $("#signupBackdrop").removeClass("show");
    $("#signupModal").removeClass("show");
  });

  $(".custom-modal").click(function(e) {
    e.stopPropagation();
  });

  initializeFormValidation();
}

function initializeFormValidation() {
  $.validator.addMethod("strongPassword", function (value, element) {
    // At least 8 characters, 1 capital letter, 1 number
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
  }, "Password must be at least 8 characters, contain at least one uppercase letter and one number.");
  $.validator.addMethod("noSpaceOnly", function (value, element) {
    return $.trim(value).length > 0;
  }, "This field cannot be empty or just spaces.");

  $.validator.addMethod("noWhitespace", function (value, element) {
    return /^\S+$/.test(value);
  }, "No spaces allowed.");

  $.validator.addMethod("validName", function (value, element) {
    return /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/.test(value.trim());
  }, "Please enter a valid name (letters, spaces, hyphens, and apostrophes only).");

  $.validator.addMethod("validEmail", function (value, element) {
    var trimmed = value.trim();
    
    return /^[a-zA-Z0-9]+[._][a-zA-Z0-9._]*@[a-zA-Z0-9.-]+\.com$/.test(trimmed);
  }, "Email must contain letters, numbers, and either underscore or period. Include '@', and end with '.com'.");

  $.validator.addMethod("validContact", function (value, element) {
    var trimmed = value.trim();
    return /^9\d{9}$/.test(trimmed);
  }, "Contact number must start with number 9 and be exactly 10 digits.");

  $("#loginForm").validate({
    rules: {
      loginUser: {
        required: true,
        noSpaceOnly: true,
        noWhitespace: true
      },
      loginPassword: {
        required: true,
        noSpaceOnly: true,
        noWhitespace: true
      }
    },
    messages: {
      loginUser: {
        required: "Please enter your username."
      },
      loginPassword: {
        required: "Please enter your password."
      }
    },
    errorClass: "is-invalid",
    validClass: "is-valid",
    errorElement: "div",
    errorPlacement: function (error, element) {
      error.addClass("invalid-feedback");
      error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function (element) {
      $(element).removeClass("is-invalid").addClass("is-valid");
    },
    submitHandler: function(form) {
      alert("Login successful!");
      $("#loginBackdrop").removeClass("show");
      $("#loginModal").removeClass("show");
      form.reset();
      $("#loginForm").find(".is-valid").removeClass("is-valid");
      return false;
    }
  });

  $("#signupForm").validate({
    rules: {
      firstName: {
        required: true,
        noSpaceOnly: true,
        validName: true
      },
      lastName: {
        required: true,
        noSpaceOnly: true,
        validName: true
      },
      address: {
        required: true,
        noSpaceOnly: true
      },
      signupEmail: {
        required: true,
        email: true,
        noSpaceOnly: true,
        validEmail: true
      },
      contactNumber: {
        required: true,
        noSpaceOnly: true,
        validContact: true
      },
      signupPassword: {
        required: true,
        strongPassword: true,
        noSpaceOnly: true,
        noWhitespace: true
      },
      confirmPassword: {
        required: true,
        equalTo: "#signupPassword"
      }
    },
    messages: {
      firstName: {
        required: "Please enter your first name."
      },
      lastName: {
        required: "Please enter your last name."
      },
      address: {
        required: "Please enter your address."
      },
      signupEmail: {
        required: "Please enter your email.",
        email: "Enter a valid email address."
      },
      contactNumber: {
        required: "Please enter your contact number."
      },
      signupPassword: {
        required: "Please enter a password.",
        minlength: "Password must be at least 6 characters."
      },
      confirmPassword: {
        required: "Please confirm your password.",
        equalTo: "Passwords do not match."
      }
    },
    errorClass: "is-invalid",
    validClass: "is-valid",
    errorElement: "div",
    errorPlacement: function (error, element) {
      error.addClass("invalid-feedback");
      error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function (element) {
      $(element).removeClass("is-invalid").addClass("is-valid");
    },
    submitHandler: function(form) {
      alert("Signup successful! Welcome to Threadful!");
      $("#signupBackdrop").removeClass("show");
      $("#signupModal").removeClass("show");
      form.reset();
      $("#signupForm").find(".is-valid").removeClass("is-valid");
      return false;
    }
  });
}

function setActiveNavLink() {
  var currentPage = window.location.pathname.split("/").pop();
  
  $('.nav-link').removeClass('active');
  $('.nav-link').each(function() {
    var href = $(this).attr('href');
    if (href && (href.includes(currentPage) || (currentPage === '' && href.includes('index.html')))) {
      $(this).addClass('active');
    }
  });
}