function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

const loadLessons = () => {
  fetch('https://openapi.programming-hero.com/api/levels/all')
    .then((res) => res.json())
    .then((json) => renderLessons(json.data));
}

const manageSpinner = () => {
  document.getElementById('loading-spinner').classList.toggle('hidden');
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
  manageSpinner();
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
  manageSpinner();
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
          <div onclick="loadWord(${word.id})" class="p-1.5 bg-[#1a91ff1a] rounded-md hover:bg-[#1a91ff80]"><i class="fa-solid fa-circle-exclamation"></i></div>
          <div onclick="pronounceWord('${word.word}')" class="p-1.5 bg-[#1a91ff1a] rounded-md hover:bg-[#1a91ff80]"><i class="fa-solid fa-volume-high"></i></div>
        </div>
      </div>
    `;
    lessonWordsContainer.append(wordDiv);
  });
  manageSpinner();
}

const loadWord = (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => renderWordModal(json.data));
}

const renderWordModal = (word) => {
  const modalContainer = document.getElementById('modal-container');
  modalContainer.innerHTML = '';
  const modalBox = document.createElement('div');
  modalBox.innerHTML = `
    <dialog id="my_modal_1" class="modal">
      <div class="modal-box p-3">
        <div class="border border-[#EDF7FF] rounded-xl p-3">
          <h1 class="text-2xl font-bold">${word.word} (<span><i class="fa-solid fa-microphone-lines"></i></span>:${word.pronunciation})</h1>
          <h2 class="font-bold text-xl mt-7 mb-2">Meaning</h2>
          <p class="bangla-font font-semibold text-2xl">${word.meaning}</p>
          <h2 class="font-bold text-xl mt-6 mb-2">Example</h2>
          <p class="text-xl">${word.sentence}</p>
          <h2 class="bangla-font font-semibold text-xl mt-6 mb-2">সমার্থক শব্দ গুলো</h2>
          <div id="synonyms-container"></div>
        </div>
        <div class="modal-action justify-start mt-4">
            <form method="dialog">
              <!-- if there is a button in form, it will close the modal -->
              <button class="btn btn-primary">Complete Learning</button>
            </form>
          </div>
      </div>
    </dialog>
  `;
  modalContainer.append(modalBox);

  const synonymsContainer = document.getElementById('synonyms-container');
  synonymsContainer.append(renderSynonyms(word.synonyms));

  document.getElementById('my_modal_1').showModal();
}

const renderSynonyms = (synonyms) => {
  const synonymsContainer = document.createElement('div');
  synonymsContainer.classList.add('flex', 'gap-4', 'w-fit');
  synonymsContainer.innerHTML = '';

  synonyms.forEach(word => {
    const singleWord = document.createElement('div');
    singleWord.innerHTML = `
      <p class="p-2 px-4 rounded-xl bg-[#EDF7FF] border border-[#D7E4EF]">${word}</p>
    `;
    synonymsContainer.append(singleWord);
  });
  return synonymsContainer;
}

loadLessons();

document.getElementById('btn-search').addEventListener('click', () => {
  const search = document.getElementById('input-search').value.trim().toLowerCase();
  
  fetch('https://openapi.programming-hero.com/api/words/all')
    .then((res) => res.json())
    .then((json) => {
      const allWords = json.data;
      console.log(allWords);
      const filterWords = allWords.filter((entity) => entity.word.includes(search));
      const errorTab = document.getElementById('error-tab');
      errorTab.classList.add('hidden');
      const noLessonSelected = document.getElementById('no-lesson-selected');
      noLessonSelected.classList.add('hidden');
      manageSpinner();
      filterWords.length !== 0 ? renderLessonWords(filterWords) : renderErrorTab();
    });
});
