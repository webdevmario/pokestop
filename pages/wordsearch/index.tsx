import { useEffect, useState } from "react";
import Title from "@/components/layout/title";

function WordsearchScreen() {
  const [grid, setGrid] = useState([]);
  const [words, setWords] = useState([
    'URSALUNA',
    'SLURPUFF',
    'SPINDA',
    'VICTINI',
    'SMEARGLE',
    'TOEDSCRUEL',
    'KADABRA',
    'ZAMAZENTA',
    'POLTCHAGEIST',
    'PAWMOT',
  ]);
  const directionTypes = ['horizontal', 'vertical', 'diagonal'];
  const isReversed = Math.random() < 0.5;
  const direction = directionTypes[Math.floor(Math.random() * directionTypes.length)];

  const buildGrid = () => {
    const grid = [];

    for (let i = 0; i < 30; i++) {
      const row = [];

      for (let j = 0; j < 30; j++) {
        row.push('X');
      }

      grid.push(row);
    }

    return grid;
  }

  const handleUpdateWord = (text, index) => {
    const updatedWords = [...words];

    updatedWords[index] = text.target.value;

    setWords(updatedWords);
  }

  useEffect(() => {
    const grid = buildGrid();

    setGrid(grid);
  } , []);

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <Title name="Wordsearch" />
      <div className="w-full">
        <div className="bg-red-500 p-4 text-black grid grid-cols-4 gap-2">
          {
            words.map((word, index) => (
              <div key={index}>
                <input type="text" value={word} className="p-1 rounded-md" onChange={(text) => handleUpdateWord(text, index) } /></div>
            ))
          }
          {/* ENTER WORDS (OR RANDOMLY RETRIEVE A LIST OF POKEMON TO USE) */}
          {/* BUILD & START OVER BUTTON */}
          {/* BUILD & SHOW GRID */}
          {/* ACTIVE WORD BANK */}
          {/* BUILD SELECTION TOOL, HIGHLIGHT WORDS */}
        </div>
        <div className="my-8">
          <button className="rounded-md px-4 py-2 font-bold bg-blue-500">Create Puzzle</button>
        </div>
        <div className="bg-white text-black rounded-md w-full my-8">
          {
            grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-between bg-slate-500">
                {
                  row.map((cell, cellIndex) => (
                    <div key={cellIndex} className="w-10 h-10 bg-gray-200 flex items-center justify-center">{cell}</div>
                  ))
                }
              </div>
            ))
          }
        </div>
        <div>
          <ul>
            {
              words.map((word, index) => (
                <li key={index}>{word}</li>
              ))
            }
            </ul>
        </div>
      </div>
    </main>
  );
}

export default WordsearchScreen;
