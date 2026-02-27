const $ = (id) => document.getElementById(id);

const modal = $("job-modal");
const jobForm = $("job-form");
const jobsContainer = $("featured-jobs-container");
const noJobsMsg = $("no-jobs-message");
const searchInput = $("search-input");
const sectionTitle = document.querySelector(".featured-jobs .section-title");

let jobs = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Google",
    location: "Bangalore",
    description: "Build scalable web applications using modern technologies.",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Amazon",
    location: "Mumbai",
    description: "Analyze large datasets and generate business insights.",
  },
];

renderJobs();

function openModal() {
  $("modal-title").textContent = "Post a New Job";
  $("edit-job-id").value = "";
  jobForm.reset();
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

$("open-post-job-modal").onclick = openModal;
$("open-post-job-modal-2").onclick = openModal;
document.querySelector(".close-modal").onclick = closeModal;
window.onclick = (e) => {
  if (e.target === modal) closeModal();
};

// Search
function performSearch() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    sectionTitle.textContent = "Featured Jobs";
    return renderJobs(jobs);
  }
  const filtered = jobs.filter((j) =>
    [j.title, j.company, j.location, j.description].some((val) =>
      val.toLowerCase().includes(q),
    ),
  );
  sectionTitle.textContent = `Search Results (${filtered.length})`;
  renderJobs(filtered);
  jobsContainer.scrollIntoView({ behavior: "smooth" });
}

$("search-btn").onclick = performSearch;
searchInput.onkeydown = (e) => {
  if (e.key === "Enter") performSearch();
};
searchInput.oninput = () => {
  if (!searchInput.value.trim()) {
    sectionTitle.textContent = "Featured Jobs";
    renderJobs(jobs);
  }
};

// Post / Edit Job
jobForm.onsubmit = (e) => {
  e.preventDefault();
  const data = {
    title: $("job-title").value,
    company: $("company-name").value,
    location: $("job-location").value,
    description: $("job-description").value,
  };
  const editId = $("edit-job-id").value;

  if (editId) {
    const i = jobs.findIndex((j) => j.id === +editId);
    if (i > -1) jobs[i] = { ...jobs[i], ...data };
  } else {
    jobs.push({ id: Date.now(), ...data });
  }

  searchInput.value = "";
  sectionTitle.textContent = "Featured Jobs";
  renderJobs(jobs);
  closeModal();
  jobForm.reset();
  jobsContainer.scrollIntoView({ behavior: "smooth" });
};

// Render Jobs
function renderJobs(list = jobs) {
  jobsContainer.innerHTML = "";
  noJobsMsg.style.display = jobs.length ? "none" : "block";

  if (!list.length && jobs.length) {
    jobsContainer.innerHTML =
      '<div class="no-results"><p>No jobs match your search.</p></div>';
    return;
  }

  list.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";
    card.innerHTML = `
      <h3 class="job-title">${job.title}</h3>
      <p class="company-name">${job.company}</p>
      <div class="job-details"><span>📍 ${job.location}</span></div>
      <p class="job-skills">${job.description}</p>
      <div class="card-actions">
        <button class="btn btn-sm btn-edit" onclick="editJob(${job.id})">Edit</button>
        <button class="btn btn-sm btn-delete" onclick="deleteJob(${job.id})">Delete</button>
      </div>
    `;
    jobsContainer.appendChild(card);
  });
}

window.editJob = (id) => {
  const job = jobs.find((j) => j.id === id);
  if (!job) return;
  $("job-title").value = job.title;
  $("company-name").value = job.company;
  $("job-location").value = job.location;
  $("job-description").value = job.description;
  $("edit-job-id").value = job.id;
  $("modal-title").textContent = "Edit Job Details";
  modal.style.display = "block";
};

window.deleteJob = (id) => {
  if (!confirm("Are you sure you want to delete this job?")) return;
  jobs = jobs.filter((j) => j.id !== id);
  searchInput.value = "";
  sectionTitle.textContent = "Featured Jobs";
  renderJobs(jobs);
};
