/* =====================================================================
   TEAM  -  edit this file to update the People section.

   HOW TO ADD A PHOTO
   1. Put the photo in the folder  images/team/
      (square photos look best, about 600 x 600 pixels, .jpg)
   2. Write its path in "photo", for example:  photo: "images/team/akash-maity.jpg"
   If "photo" is left empty (""), the initials are shown instead.

   HOW TO ADD A PERSON
   Copy one { ... } block, paste it below the last one, and edit it.
   Keep the comma after each closing brace  },

   All fields except name and role are optional; leave them "" if unused.
   ===================================================================== */

window.TEAM = {

  /* Principal Investigator (shown in its own section) */
  pi: {
    name: "Dr. Syed K. Hasan",
    photo: "images/team/syed-hasan.jpg",
  },

  /* Current lab members, shown in this order */
  current: [
    { name: "Mr. Anup Jha",         role: "PhD Student",                  photo: "images/team/anup-jha.jpg",         topic: "", LinkedIn: "linkedin.com/in/anup-jha-088486252", link: "" },
    { name: "Ms. Neha Gupta",       role: "PhD Student",                  photo: "images/team/neha-gupta.jpg",       topic: "", LinkedIn: "linkedin.com/in/neha-gupta-pg11", link: "" },
    { name: "Ms. Ananya Ghosh",     role: "PhD Student",                  photo: "images/team/ananya-ghosh.jpg",     topic: "", LinkedIn: "", link: "" },
    { name: "Mr. Swastik Sastri",   role: "PhD Student",                  photo: "images/team/swastik-sastri.jpg",   topic: "", LinkedIn: "linkedin.com/in/swastik-s-1b5679215", link: "" },
    { name: "Dr. Akash Maity",      role: "Mizuho Postdoctoral Fellow",   photo: "images/team/akash-maity.jpg",      topic: "", LinkedIn: "linkedin.com/in/akash-maity-ph-d-93945b219", link: "" },
    { name: "Dr. Deepshikha Dutta", role: "Project Research Fellow",      photo: "images/team/deepshikha-dutta.jpg", topic: "", LinkedIn: "linkedin.com/in/dr-deepshikha-dutta-00a1b024a", link: "" },
    { name: "Dr. Syeda Begum",      role: "Postdoctoral Fellow",          photo: "images/team/syeda-begum.jpg",      topic: "", LinkedIn: "linkedin.com/in/syeda-nurunnesa-a2751b1a5", link: "" },
    { name: "Mr. Yuvraj Nikam",     role: "Scientific Assistant",         photo: "images/team/yuvraj-nikam.jpg",     topic: "", LinkedIn: "", link: "" },
  ],

  /* Alumni. "now" (present position) and "photo" are optional. */
  alumni: [
    { name: "Dr. Rohit Kumar",          role: "Postdoctoral Fellow",    years: "2018–2021", photo: "images/team/rohit-kumar.jpg",          now: "Scientific Officer 'E', MPMMCC, TMC, Varanasi", LinkedIn: "linkedin.com/in/rohit-kumar-752057a9" },
    { name: "Dr. Rudra Prasad Dutta",   role: "Postdoctoral Fellow",    years: "2019–2022", photo: "images/team/rudraprasad-dutta.jpg",    now: "Assistant Professor, Icahn School of Medicine at Mount Sinai, USA", LinkedIn: "linkedin.com/in/rudra-prasad-dutta-2606b921a" },
    { name: "Dr. Tarang Gaur",          role: "PhD Student",            years: "2017–2024", photo: "images/team/tarang-gaur.jpg",          now: "Albert Einstein College of Medicine, USA", LinkedIn: "linkedin.com/in/taranggaur777" },
    { name: "Ms. Aditi Vijan",          role: "Project Junior Fellow",  years: "2023–2024", photo: "images/team/aditi-vijan.jpg",          now: "PhD Student, Indiana University School of Medicine, USA", LinkedIn: "linkedin.com/in/vijanaditi" },
    { name: "Ms. Bhavyadarshini Arun",  role: "Junior Research Fellow", years: "2025–2026", photo: "images/team/bhavyadharshini-arun.jpg", now: "", LinkedIn: "linkedin.com/in/bhavyadharshini-arun-709373249" },
    { name: "Ms. Nishtha Tripathi",     role: "Junior Research Fellow", years: "2025–2026", photo: "images/team/nishtha-tripathi.jpg",     now: "PhD Student, TMC-ACTREC", LinkedIn: "linkedin.com/in/nishtha-tripathi-58b980199" },
    { name: "Dr. Akash Maity",          role: "PhD Student",            years: "2021–2026", photo: "images/team/akash-maity.jpg",          now: "Mizuho Postdoctoral Fellow, ACTREC", LinkedIn: "linkedin.com/in/akash-maity-ph-d-93945b219" },
    { name: "Dr. Deepshikha Dutta",     role: "PhD Student",            years: "2019–2026", photo: "images/team/deepshikha-dutta.jpg",     now: "Project Research Fellow, ACTREC", LinkedIn: "linkedin.com/in/dr-deepshikha-dutta-00a1b024a" },
  ],

  /* Current interns and research trainees (shown as name chips) */
  trainees: [
    { name: "Ms. Sinchana Hegde" },
    { name: "Ms. Virti Chedha" },
    { name: "Ms. Misbah Shaikh" },
    { name: "Ms. Arhita Mondal" },
  ],

  /* Lab photo gallery: opens in a pop-up viewer.
     "full" is the large image, "thumb" the small preview (640 x 480). */
  gallery: [
    { full: "images/gallery/lab-01.jpg", thumb: "images/gallery/lab-01-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-02.jpg", thumb: "images/gallery/lab-02-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-03.jpg", thumb: "images/gallery/lab-03-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-04.jpg", thumb: "images/gallery/lab-04-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-05.jpg", thumb: "images/gallery/lab-05-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-06.jpg", thumb: "images/gallery/lab-06-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-07.jpg", thumb: "images/gallery/lab-07-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-08.jpg", thumb: "images/gallery/lab-08-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-09.jpg", thumb: "images/gallery/lab-09-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-10.jpg", thumb: "images/gallery/lab-10-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-11.jpg", thumb: "images/gallery/lab-11-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-12.jpg", thumb: "images/gallery/lab-12-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-13.jpg", thumb: "images/gallery/lab-13-thumb.jpg", caption: "" },
    { full: "images/gallery/lab-14.jpeg", thumb: "images/gallery/lab-14-thumb.jpg", caption: "" }, 
    { full: "images/gallery/lab-15.jpeg", thumb: "images/gallery/lab-15-thumb.jpg", caption: "" }, 
    { full: "images/gallery/lab-16.jpeg", thumb: "images/gallery/lab-16-thumb.jpg", caption: "" },
  ],
};
