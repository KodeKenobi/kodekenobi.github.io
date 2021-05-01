//  Work experience cards


const experiencecards = document.querySelector(".experience-cards");
const exp = [
  {
    title: "Open Source Software Developer",
    cardImage: "assets/images/experience-page/gdev.gif",
    place: "Google Developer",
    time: "(Feb, 2017 - present)",
    desp: "<li>Reviewing other people's code and helping them improve.</li> <li>Writing design documents that states the problem being solved, alternatives considered and why you picked one of them.</li> <li>Testing code.</li> <li>Writing readable code in C++, Java, Python or Go.</li>",
  },
  {
    title: "Multi-Disciplinary Visual Designer",
    cardImage: "assets/images/experience-page/icons.gif",
    place: "Adobe Suite",
    time: "(Mar, 2015 - present)",
    desp: "<li>Typography Logos.</li><li>Illustrations.</li><li>Graphic Design.</li><li>Brand Identity.</li><li>Motion Designs.</li>",
  },
  {
    title: "Full Stack Developer",
    cardImage: "assets/images/experience-page/stack.gif",
    place: "Vader Media",
    time: "(Jun, 2020 - present)",
    desp:"<li>Designing client-side and server-side architecture. Building front-end of applications through appealing visual designs. Testing software to ensure responsiveness and efficiency. Building features and applications with a mobile responsive design and writing technical documentation.</li>",
  },    
  {
    title: "Mobile Application Developer",
    cardImage: "assets/images/experience-page/app.gif",
    place: "Kode Kenobi Studios",
    time: "Feb, 2015 - present",
    desp: "<li>To understand clients' applications requirements. Identifying key application features. Designing creative prototypes based on specifications. Writing high quality source code to program complete applications. Writing high quality source code to program complete applications.</li>"
  }  
];

const showCards2 = () => {
  let output = "";
  exp.forEach( 
    ({ title, cardImage, place, time, desp }) =>
      (output += `        
      <ul>
      <li class="card card1">
        <img src="${cardImage}" class="featured-image"/>
        <article class="card-body">
          <header>
            <div class="title">
              <h3>${title}</h3>
            </div>
            <p class="meta">
              <span class="pre-heading">${place}</span><br>
              <span class="author">${time}</span>
            </p>
            <ol>
              ${desp}
            </ol>
          </header>
        </article>
      </li>
    </ul>
      `)
  );
  experiencecards.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards2);




const showCards = () => {
  let output = "";
  volunteershipcards.forEach(
    ({ title, cardImage, description }) =>
      (output += `        
      <div class="card volunteerCard" style="height: 600px;width:400px">
      
      <img src="${cardImage}" height="300" width="65" class="card-img" style="border-radius:10px">
      <div class="content">
          <h2 class="volunteerTitle">${title}</h2><br>
          <p class="copy">${description}</p></div>
      
      </div>
      `)
  );
  volunteership.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards);


// Mentorship Card


const mentorshipcards = document.querySelector(".mentorship-cards");
const mentor = [
  {
    title: "HakinCode",
    image: "assets/images/experience-page/hakin.png",
    time: "06/2020 - 08/2020",
    desp: "<li>It is an open source community where students and mentors can apply.</li><hr /><li>Ample amount of technologies and projects are there and we are given opportunity to work on them according to our interest and knowledge.</li>",
  },
  {
    title: "Google Summer of Code",
    image: "assets/images/experience-page/gsoc.png",
    time: "03/2020 - 08/2020",
    desp: "<li>Google Summer of Code is a global program focused on introducing students to open source software development.</li><hr /><li>It is a great platform to explore new areas, maybe discover a new career path!</li>",
  },
];

const showCards3 = () => {
  let output = "";
  mentor.forEach(
    ({ title, image, time, desp}) =>
      (output += `        
      <div class="column mentorshipCard"> 
      <div class="card card2 mentorshipCardCover">
        <img src="${image}" class="card-img-top" alt="..."  width="64" height="300">
        <div class="information">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class=""sub-title">${time}</p>
        </div>
        <div class="more-information">
        <ul class="list-group list-group-flush p-0 right-aligned">
          <div class="list-group-item card2 disclaimer">${desp}</div>
        </ul>
        </div>
        </div>
      </div>
      </div>
      `)
  );
  mentorshipcards.innerHTML = output;
};
document.addEventListener("DOMContentLoaded", showCards3);
