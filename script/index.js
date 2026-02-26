const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all')
    .then((res) => res.json())
    .then((json) => renderLessons(json.data));
}

const levelContainer = document.getElementById('level-container');
levelContainer.addEventListener('click', (e) => {
  const lessonButtons = document.querySelectorAll('.lesson-button');
  lessonButtons.forEach((btn) => {
    btn.classList.remove('bg-[#422ad5]','text-white');
  });
  e.target.closest('.lesson-button').classList.add('bg-[#422ad5]', 'text-white');
});

const renderLessons = (lessons) => {
  const levelContainer = document.getElementById('level-container');
  levelContainer.innerHTML = '';
  const lessonFragment = document.createDocumentFragment();

  lessons.forEach(lesson => {
    const lessonBtn = document.createElement('div');
    lessonBtn.innerHTML = `
      <button href="" onclick="loadLessonWords(${lesson.level_no})" class="btn btn-outline btn-primary lesson-button"><i class="fa-solid fa-book-open"></i>Lesson-${lesson.level_no}</button>
    `;
    lessonFragment.append(lessonBtn);
  });
  levelContainer.append(lessonFragment);
}

const loadLessonWords = (id) => {
  const errorTab = document.getElementById('error-tab');
  errorTab.classList.add('hidden');
  const noLessonSelected = document.getElementById('no-lesson-selected');
  noLessonSelected.classList.add('hidden');
  console.log(id);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      if(json.data.length !== 0)
        renderLessonWords(json.data);
      else
        renderErrorTab();
    });
}

const renderErrorTab = () => {
  const errorTab = document.getElementById('error-tab');
  errorTab.classList.remove('hidden');
  const lessonWordsContainer = document.getElementById('lesson-words-container');
  lessonWordsContainer.classList.add('hidden');
  console.log(lessonWordsContainer);
}

const renderLessonWords = (words) => {
  const lessonWordsContainer = document.getElementById('lesson-words-container');
  lessonWordsContainer.classList.remove('hidden');
  lessonWordsContainer.classList.add('grid');
  lessonWordsContainer.innerHTML = '';

  words.forEach((word) => {
    const wordDiv = document.createElement('div');
    wordDiv.classList.add('h-full');
    wordDiv.innerHTML = `
      <div class="word flex flex-col justify-between h-full text-center p-8 border rounded-2xl bg-white">
        <div>
          <h2 class="font-bold text-2xl">${word.word ? word.word : 'Word Unavailable'}</h2>
          <p class="my-3 text-lg">Meaning/Pronunciation</p>
          <h1 class="font-bold bangla-font text-2xl mb-2">"${word.meaning ? word.meaning : 'অর্থ পাওয়া যায়নি'} / ${word.pronunciation ? word.pronunciation : 'উচ্চারণ পাওয়া যায়নি'}"</h1>
        </div>
        <div class="flex justify-between">
          <div onclick="my_modal_1.showModal()" class="p-1.5 bg-[#1a91ff1a] rounded-md hover:bg-[#1a91ff80]"><i class="fa-solid fa-circle-exclamation"></i></div>
          <div class="p-1.5 bg-[#1a91ff1a] rounded-md hover:bg-[#1a91ff80]"><i class="fa-solid fa-volume-high"></i></div>
        </div>
      </div>
    `;
    lessonWordsContainer.append(wordDiv);
  });
}


loadLessons();