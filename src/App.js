import './App.css';
import React, { useState } from 'react';
import { filteredDataSources } from './mockdata.js';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [typedTerms, setTypedTerms] = useState([]);
  const [highlightedData, setHighlightedData] = useState(filteredDataSources);

  const handleEnterKey = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      const newTerm = inputValue.trim();
      if (!typedTerms.includes(newTerm)) {
        const newTypedTerms = [...typedTerms, newTerm];
        setTypedTerms(newTypedTerms);
        setHighlightedData(highlightText(filteredDataSources, newTypedTerms));
      }
      setInputValue('');
    }
  };

  const removeTerm = (term) => {
    const updatedTerms = typedTerms.filter((t) => t !== term);
    setTypedTerms(updatedTerms);
    setHighlightedData(highlightText(filteredDataSources, updatedTerms));
  };

  const highlightText = (data, terms) => {
    const regex = new RegExp(`(${terms.join('|')})`, 'gi');

    const processText = (text) => text.replace(regex, '<mark>$1</mark>');

    return data.map((source) => ({
      ...source,
      title: processText(source.title),
      documents: source.documents.map((document) => ({
        ...document,
        title: processText(document.title),
        keywords: document.keywords.map(processText),
        summary: processText(document.summary),
      })),
    }));
  };

  return (
    <div className="App">
      <h1>Highlight Text</h1>

      <div><input
          type="text"
          className="form-input"
          id="input"
          placeholder="Enter text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleEnterKey}
        />
      </div>

      <div className="typed-terms">
        Filter terms:
        {typedTerms.map((term, index) => (
          <span key={index} className="term">
            {term} <span onClick={() => removeTerm(term)} className="remove-term">x</span>
          </span>
        ))}
      </div>

      <div className="main-container">
        {highlightedData.map((source, sourceIndex) => (
          <div key={sourceIndex}>
            <h2
              className="source-name"
              dangerouslySetInnerHTML={{ __html: source.title }}
            ></h2>
            {source.documents.map((document, docIndex) => (
              <div className="document-content" key={docIndex}>
                <span className='document-header'>
                  <h3 dangerouslySetInnerHTML={{ __html: document.title }}></h3>
                  <p className="keywords">
                    Keywords: {document.keywords.map((keyword, kwIndex) => (
                      <span key={kwIndex} dangerouslySetInnerHTML={{ __html: keyword }}></span>
                    ))}
                  </p>
                </span>
                <p
                  className="summary"
                  dangerouslySetInnerHTML={{ __html: document.summary }}
                ></p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
