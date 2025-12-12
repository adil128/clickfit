$(function () {
  $("#year").text(new Date().getFullYear());

  function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  }

  function updateLastFetched() {
    const now = new Date();
    const timeString = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const dateString = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    $("#last-fetched").text(`${dateString} at ${timeString}`);
  }

  let motivationTimer = null;

  const $numberFact = $("#number-fact");
  const $motivationQuote = $("#motivation-quote");

  function clearMotivationTimer() {
    if (motivationTimer) {
      clearTimeout(motivationTimer);
      motivationTimer = null;
    }
  }

  function showFallbackMotivation() {
    if ($numberFact.find(".spinner-border").length) {
      $numberFact.html("");
      $motivationQuote.addClass("visible");
    }
  }

  function loadDateFact() {
    console.log(" Fetching from Numbers API...");

    const apiUrl = "http://numbersapi.com/1/30/date?json";

    $("#api-status-text").text("Fetching from Numbers API...");
    $(".status-dot").removeClass("connected error").addClass("pulse");
    $("#api-fact-text").html(
      '<div class="spinner-border spinner-border-sm text-warning me-2"></div> Loading from Numbers API...'
    );
    $("#api-raw-data").text(
      `{\n  "status": "fetching",\n  "url": "${apiUrl}"\n}`
    );

    $motivationQuote.removeClass("visible");

    clearMotivationTimer();
    motivationTimer = setTimeout(showFallbackMotivation, 2000);

    $.ajax({
      url: apiUrl,
      method: "GET",
      dataType: "json",
      timeout: 10000,
      headers: {
        Accept: "application/json",
      },
    })
      .done(function (data) {
        console.log("✅ Numbers API Success:", data);
        clearMotivationTimer();
        $motivationQuote.removeClass("visible");
        $(".status-dot").removeClass("pulse").addClass("connected");
        $("#api-status-text").html(
          '<span class="text-success"><i class="fas fa-check-circle me-1"></i>Numbers API Data Loaded!</span>'
        );

        if (data.text) {
          $("#number-fact").html(
            '<i class="fas fa-lightbulb me-2 text-warning"></i>' + data.text
          );
          $("#api-fact-text").html(
            '<i class="fas fa-quote-left me-2 text-warning"></i>' + data.text
          );
        } else {
          $("#api-fact-text").html(
            '<span class="text-muted">No fact available from Numbers API</span>'
          );
        }

        $("#api-raw-data").text(JSON.stringify(data, null, 2));
        updateLastFetched();
      })
      .fail(function (xhr, status, error) {
        console.error(" Numbers API Error:", status, error);
        clearMotivationTimer();
        $numberFact.html("");
        $motivationQuote.addClass("visible");

        $(".status-dot").removeClass("pulse").addClass("error");
        $("#api-status-text").html(
          '<span class="text-danger"><i class="fas fa-times-circle me-1"></i>Numbers API Connection Failed</span>'
        );

        let errorMessage = "Failed to fetch from Numbers API.";
        if (status === "timeout") {
          errorMessage = "Numbers API request timed out.";
        } else if (status === "parsererror") {
          errorMessage = "Invalid response from Numbers API.";
        } else if (error) {
          errorMessage = `Error: ${error}`;
        }

        $("#api-fact-text").html(
          '<span class="text-danger"><i class="fas fa-exclamation-triangle me-2"></i>' +
            errorMessage +
            "</span>"
        );

        const errorData = {
          error: true,
          status: status,
          url: apiUrl,
          message: errorMessage,
          timestamp: new Date().toISOString(),
        };
        $("#api-raw-data").text(JSON.stringify(errorData, null, 2));
        updateLastFetched();
      });
  }

  loadDateFact();

  $("#refresh-api").on("click", function () {
    $(this).find("i").addClass("fa-spin");
    loadDateFact();

    setTimeout(() => {
      $(this).find("i").removeClass("fa-spin");
    }, 1000);
  });

  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault();
    var target = $(this.getAttribute("href"));
    if (target.length) {
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: target.offset().top - 80,
          },
          1000
        );
    }
  });

  const $upload = $("#upload-area");
  const $fileInput = $("#file-input");
  const $status = $("#upload-status");
  const $uploadedList = $("#uploaded-list");

  function preventDefault(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  $upload.on("click", function (e) {
    if (!$(e.target).closest(".uploaded-item").length) {
      if ($fileInput && $fileInput.length && $fileInput[0]) {
        try {
          $fileInput[0].click();
        } catch (err) {
          $fileInput.trigger("click");
        }
      }
    }
  });

  $fileInput.on("change", function (e) {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  });

  $upload
    .on("dragenter", function (e) {
      preventDefault(e);
      $upload.addClass("dragover");
    })
    .on("dragover", function (e) {
      preventDefault(e);
      $upload.addClass("dragover");
    })
    .on("dragleave", function (e) {
      preventDefault(e);
      if (!$(e.relatedTarget).closest($upload).length) {
        $upload.removeClass("dragover");
      }
    })
    .on("drop", function (e) {
      preventDefault(e);
      $upload.removeClass("dragover");

      const dt = e.originalEvent.dataTransfer;
      if (dt && dt.files && dt.files.length > 0) {
        handleFiles(dt.files);
      }
    });

  function handleFiles(files) {
    if (!files || !files.length) return;

    const fileArray = Array.from(files).slice(0, 10);

    const validFiles = [];
    const errors = [];
    const maxSize = 10 * 1024 * 1024;

    fileArray.forEach((file) => {
      if (!file.type.match("image.*")) {
        errors.push(`${file.name}: Not an image file`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: Exceeds 10MB limit`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      $status.html(`
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    ${errors.join("<br>")}
                </div>
            `);
    }

    if (validFiles.length === 0) return;

    const formData = new FormData();
    validFiles.forEach((file) => formData.append("images", file));

    $status.html(`
            <div class="alert alert-info">
                <div class="d-flex align-items-center">
                    <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                    <div>Uploading ${validFiles.length} file(s)...</div>
                </div>
            </div>
        `);

    $.ajax({
      url: "/upload",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      timeout: 10000,
    })
      .done(function (response) {
        if (response && response.files && response.files.length > 0) {
          $status.html(`
                    <div class="alert alert-success">
                        <i class="fas fa-check-circle me-2"></i>
                        Successfully uploaded ${response.files.length} file(s)
                    </div>
                `);

          displayUploadedFiles(response.files);

          $upload
            .find(".upload-icon")
            .html('<i class="fas fa-check-circle"></i>');
          $upload.find(".upload-icon").css("color", "#28a745");
          setTimeout(() => {
            $upload
              .find(".upload-icon")
              .html('<i class="fas fa-cloud-upload-alt"></i>');
            $upload.find(".upload-icon").css("color", "");
          }, 2000);
        }
      })
      .fail(function (xhr, status, error) {
        let errorMessage = "Upload failed. Please try again.";

        if (xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage = xhr.responseJSON.error;
        } else if (xhr.statusText) {
          errorMessage = xhr.statusText;
        }

        $status.html(`
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle me-2"></i>
                    ${errorMessage}
                </div>
            `);
      })
      .always(function () {
        $fileInput.val("");
      });
  }

  function displayUploadedFiles(files) {
    files.forEach((filename) => {
      const imageUrl = `/upload_images/${encodeURIComponent(filename)}`;
      const uploadedItem = $(`
                <div class="uploaded-item">
                    <img src="${imageUrl}" alt="Uploaded image" onerror="this.src='https://via.placeholder.com/150x150/333/666?text=Image'">
                    <div class="uploaded-overlay">
                        <small>${filename.substring(0, 15)}${
        filename.length > 15 ? "..." : ""
      }</small>
                    </div>
                </div>
            `);

      uploadedItem.on("click", function (e) {
        e.stopPropagation();
        window.open(imageUrl, "_blank");
      });

      $uploadedList.append(uploadedItem);
    });
  }

  function animateOnScroll() {
    $(".program-card, .motivation-box, .stats-box, .api-card").each(
      function () {
        const elementTop = $(this).offset().top;
        const elementBottom = elementTop + $(this).outerHeight();
        const viewportTop = $(window).scrollTop();
        const viewportBottom = viewportTop + $(window).height();

        if (elementBottom > viewportTop && elementTop < viewportBottom - 100) {
          $(this).addClass("animated");
        }
      }
    );
  }

  $(window).on("scroll", animateOnScroll);
  animateOnScroll();

  $(".program-card")
    .on("mouseenter", function () {
      $(this).find(".program-icon").css("transform", "scale(1.1)");
    })
    .on("mouseleave", function () {
      $(this).find(".program-icon").css("transform", "scale(1)");
    });

  $(".program-item")
    .on("mouseenter", function () {
      $(this).find("i").css("transform", "rotate(360deg)");
      $(this).find("i").css("transition", "transform 0.6s ease");
    })
    .on("mouseleave", function () {
      $(this).find("i").css("transform", "rotate(0deg)");
    });

  $(".navbar-nav .nav-link").on("click", function () {
    $(".navbar-collapse").collapse("hide");
  });
});
