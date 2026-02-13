const modal = document.getElementById("job-modal");
const openModalBtn = document.getElementById("open-post-job-modal");
const openModalBtn2 = document.getElementById("open-post-job-modal-2");
const closeModalSpan = document.querySelector(".close-modal");
const jobForm = document.getElementById("job-form");
const featuredJobsContainer = document.getElementById(
  "featured-jobs-container",
);
const noJobsMessage = document.getElementById("no-jobs-message");
const modalTitle = document.getElementById("modal-title");
const editJobIdInput = document.getElementById("edit-job-id");

let jobs = [];

function openModal() {
  modal.style.display = "block";
  modalTitle.textContent = "Post a New Job";
  jobForm.reset();
  editJobIdInput.value = "";
}

openModalBtn.onclick = openModal;
openModalBtn2.onclick = openModal;

closeModalSpan.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

jobForm.onsubmit = function (event) {
  event.preventDefault();

  const title = document.getElementById("job-title").value;
  const company = document.getElementById("company-name").value;
  const location = document.getElementById("job-location").value;
  const description = document.getElementById("job-description").value;
  const editId = editJobIdInput.value;

  if (editId) {
    const jobIndex = jobs.findIndex((job) => job.id === parseInt(editId));
    if (jobIndex > -1) {
      jobs[jobIndex] = {
        ...jobs[jobIndex],
        title,
        company,
        location,
        description,
      };
    }
  } else {
    const newJob = {
      id: Date.now(),
      title,
      company,
      location,
      description,
    };
    jobs.push(newJob);
  }

  renderJobs();
  modal.style.display = "none";
  jobForm.reset();
  featuredJobsContainer.scrollIntoView({ behavior: "smooth" });
};

function renderJobs() {
  featuredJobsContainer.innerHTML = "";

  if (jobs.length === 0) {
    noJobsMessage.style.display = "block";
  } else {
    noJobsMessage.style.display = "none";
  }

  jobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-card";

    card.innerHTML = `
      <h3 class="job-title">${job.title}</h3>
      <p class="company-name">${job.company}</p>
      <div class="job-details">
        <span>📍 ${job.location}</span>
      </div>
      <p class="job-skills">${job.description}</p>
      <div class="card-actions">
        <button class="btn btn-sm btn-edit" onclick="editJob(${job.id})">Edit</button>
        <button class="btn btn-sm btn-delete" onclick="deleteJob(${job.id})">Delete</button>
      </div>
    `;

    featuredJobsContainer.appendChild(card);
  });
}

window.editJob = function (id) {
  const job = jobs.find((j) => j.id === id);
  if (job) {
    document.getElementById("job-title").value = job.title;
    document.getElementById("company-name").value = job.company;
    document.getElementById("job-location").value = job.location;
    document.getElementById("job-description").value = job.description;
    editJobIdInput.value = job.id;

    modalTitle.textContent = "Edit Job Details";
    modal.style.display = "block";
  }
};

window.deleteJob = function (id) {
  if (confirm("Are you sure you want to delete this job?")) {
    jobs = jobs.filter((job) => job.id !== id);
    renderJobs();
  }
};
