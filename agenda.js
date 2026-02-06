const data = [
    {
        title: "Session A1: Energy Futures",
        day: "Monday",
        time: "09:00 - 10:00",
        speaker: "Jane Doe",
        image: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        description: "Explore the evolving energy landscape and sustainable strategies."
    },
    {
        title: "Session B2: Subsurface Innovations",
        day: "Tuesday",
        time: "11:00 - 12:00",
        speaker: "John Smith",
        image: "https://via.placeholder.com/60",
        description: "Innovations in reservoir characterization and drilling technology."
    }
];

const agendaList = document.getElementById("agendaList");
const dayFilter = document.getElementById("dayFilter");

function renderAgenda(filter = "") {
    agendaList.innerHTML = "";
    const filtered = data.filter(item => !filter || item.day === filter);
    filtered.forEach((session, index) => {
        const el = document.createElement("div");
        el.className = "agenda-item";
        el.innerHTML = `
        <div class="agenda-header" onclick="toggleDetails(${index})">
          <img class="speaker-img" src="${session.image}" alt="Speaker photo">
          <div class="session-info">
            <h3>${session.title}</h3>
            <p>${session.day}, ${session.time}</p>
            <p>Speaker: ${session.speaker}</p>
          </div>
        </div>
        <div class="agenda-details">${session.description}</div>
      `;
        agendaList.appendChild(el);
    });
}

function toggleDetails(index) {
    const items = document.querySelectorAll(".agenda-item");
    items[index].classList.toggle("active");
}

dayFilter.addEventListener("change", (e) => {
    renderAgenda(e.target.value);
});

renderAgenda();
