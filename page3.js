document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  // ✅ Typewriter Effect
  // ===============================
  function runTypewriter(elementId, texts, typingSpeed = 100, deletingSpeed = 100, pauseTime = 2000) {
    const element = document.getElementById(elementId);
    if (!element) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentText = texts[textIndex];

      if (!isDeleting) {
        element.innerHTML =
          currentText.substring(0, charIndex + 1) + '<span class="typewriter-cursor">|</span>';
        charIndex++;
        if (charIndex === currentText.length) {
          isDeleting = true;
          setTimeout(typeEffect, pauseTime);
          return;
        }
      } else {
        element.innerHTML =
          currentText.substring(0, charIndex - 1) + '<span class="typewriter-cursor">|</span>';
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }
      setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
    }

    typeEffect();
  }

  runTypewriter("typewriter2", [
    "I can’t get you out of my head",
    "lynx@kali:~$ sudo rm -rf /b?"
  ], 100, 100, 2000);

  // ===============================
  // ✅ Discord Profile + Status + Favicon
  // ===============================
  const userId = "1010557922335543427";

  async function fetchProfile() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      const data = await res.json();

      if (data.success) {
        const discord = data.data.discord_user;
        const status = data.data.discord_status;

        // Avatar URL
        const avatarUrl = `https://cdn.discordapp.com/avatars/${discord.id}/${discord.avatar}.png?size=512`;

        // Set profile picture in <img>
        const avatarEl = document.getElementById("avatar");
        if (avatarEl) avatarEl.src = avatarUrl;

        // Set favicon to avatar
        const faviconEl = document.getElementById("favicon");
        if (faviconEl) faviconEl.href = avatarUrl;

        // Update status circle
        const statusCircle = document.getElementById("status-circle");
        if (statusCircle) {
          statusCircle.className = "status"; // reset
          if (status === "online") statusCircle.classList.add("online");
          else if (status === "idle") statusCircle.classList.add("idle");
          else if (status === "dnd") statusCircle.classList.add("dnd");
          else statusCircle.classList.add("offline");
        }
      }
    } catch (err) {
      console.error("Profile fetch error:", err);
    }
  }

  fetchProfile();
  setInterval(fetchProfile, 2000);

  // ===============================
  // ✅ Activity / Game Playing Logic
  // ===============================
  let startTimestamp = null;

  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  }

  function updateTimePlaying() {
    if (startTimestamp) {
      const elapsed = Date.now() - startTimestamp;
      document.getElementById("time-playing").textContent =
        "Playing for " + formatDuration(elapsed);
    } else {
      document.getElementById("time-playing").textContent = "";
    }
  }

  async function fetchActivity() {
    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
      const data = await res.json();

      if (data.success) {
        const activities = data.data.activities;

        if (activities.length > 0) {
          const activity = activities[0];
          document.getElementById("activity").textContent = activity.name;

          // check timestamps for play time
          if (activity.timestamps && activity.timestamps.start) {
            startTimestamp = activity.timestamps.start;
            updateTimePlaying();
          } else {
            startTimestamp = null;
            document.getElementById("time-playing").textContent = "";
          }

          // Activity image
          let imgUrl = null;
          if (activity.assets && activity.assets.large_image) {
            imgUrl = activity.assets.large_image;

            if (imgUrl.startsWith("spotify:")) {
              imgUrl = `https://i.scdn.co/image/${imgUrl.split(":")[1]}`;
            } else if (imgUrl.startsWith("mp:")) {
              imgUrl = "https://media.discordapp.net/" + imgUrl.slice(3);
            } else {
              imgUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
            }
          }

          if (imgUrl) {
            document.getElementById("activity-img").src = imgUrl;
            document.getElementById("activity-img").style.display = "block";
          } else {
            document.getElementById("activity-img").style.display = "none";
          }
        } else {
          document.getElementById("activity").textContent = "Not playing anything";
          document.getElementById("time-playing").textContent = "";
          document.getElementById("activity-img").style.display = "none";
        }
      }
    } catch (err) {
      console.error(err);
      document.getElementById("activity").textContent = "Error fetching activity";
      document.getElementById("time-playing").textContent = "";
    }
  }

  fetchActivity();
  setInterval(fetchActivity, 2000);
  setInterval(updateTimePlaying, 1000);

  // ===============================
  // ✅ Entry Overlay + Audio Controls
  // ===============================
  const audio = document.getElementById("kanta");
  const toggleBtn = document.getElementById("toggleBtn");
  const icon = document.getElementById("icon");
  const entryOverlay = document.getElementById("entryOverlay");

  if (entryOverlay) {
    entryOverlay.addEventListener("click", () => {
      // Start music
      audio.play().catch(err => console.log("Autoplay blocked:", err));

      // Fade out overlay
      entryOverlay.classList.add("fade-out");
      setTimeout(() => {
        entryOverlay.style.display = "none";
      }, 1000); // match CSS transition duration
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = 1;
        icon.classList.remove("fa-volume-mute");
        icon.classList.add("fa-volume-up");
      } else {
        audio.muted = true;
        icon.classList.remove("fa-volume-up");
        icon.classList.add("fa-volume-mute");
      }
    });
  }
});
