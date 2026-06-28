import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { X, Search } from 'lucide-react';

const TechMultiSelect = ({ selectedTechs, onChange }) => {
  const dictionary = useSelector(state => state.tech.dictionary);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (techName) => {
    if (!selectedTechs.includes(techName)) {
      onChange([...selectedTechs, techName]);
    }
    setSearchTerm('');
    // Keep open to select multiple
  };

  const handleRemove = (techName, e) => {
    e.stopPropagation();
    onChange(selectedTechs.filter(t => t !== techName));
  };

  // Allow custom entries if they press enter and there are no exact matches
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      e.preventDefault();
      const match = filteredOptions.find(t => t.name.toLowerCase() === searchTerm.toLowerCase());
      if (match) {
        handleSelect(match.name);
      } else {
        // Add custom tech
        handleSelect(searchTerm.trim());
      }
    }
  };

  const filteredOptions = dictionary.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTechs.find(selected => selected.toLowerCase() === t.name.toLowerCase())
  );

  return (
    <div className="relative flex flex-col gap-1 w-full" ref={dropdownRef}>
      <label className="text-[12px] text-muted ml-1">Technologies *</label>
      
      {/* Selected Pills Container */}
      <div 
        className="neo-box-inset p-2 min-h-[46px] flex flex-wrap gap-2 items-center cursor-text relative"
        onClick={() => setIsOpen(true)}
      >
        {selectedTechs.map(tech => {
          const dictEntry = dictionary.find(t => t.name.toLowerCase() === tech.toLowerCase() || t.id.toLowerCase() === tech.toLowerCase());
          return (
            <span key={tech} className="flex items-center gap-1.5 text-[12px] bg-[var(--bg-color)] border border-[var(--neo-border)] px-2 py-1 rounded-md shadow-sm">
              {dictEntry && dictEntry.svg && (
                <span className="w-3.5 h-3.5 shrink-0 inline-flex items-center justify-center" dangerouslySetInnerHTML={{ __html: dictEntry.svg }} />
              )}
              {tech}
              <button 
                type="button" 
                onClick={(e) => handleRemove(tech, e)}
                className="ml-1 opacity-60 hover:opacity-100 hover:text-red-500 transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          );
        })}
        
        {/* Search Input inside the box */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selectedTechs.length === 0 ? "Search technologies..." : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-[14px] ml-1"
        />
        <Search size={14} className="text-muted absolute right-3 opacity-50" />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 neo-box z-50 max-h-[200px] overflow-y-auto py-2">
          {filteredOptions.length > 0 ? (
            filteredOptions.map(tech => (
              <div 
                key={tech.id}
                onClick={() => handleSelect(tech.name)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[var(--neo-shadow-light)] cursor-pointer text-[13px] transition-colors"
              >
                {tech.svg && <span className="w-4 h-4 shrink-0 inline-flex items-center justify-center" dangerouslySetInnerHTML={{ __html: tech.svg }} />}
                {tech.name}
              </div>
            ))
          ) : (
            searchTerm.trim() !== '' ? (
              <div 
                onClick={() => handleSelect(searchTerm.trim())}
                className="px-4 py-2 hover:bg-[var(--neo-shadow-light)] cursor-pointer text-[13px] text-[var(--text-main)] italic"
              >
                Add "{searchTerm}"
              </div>
            ) : (
              <div className="px-4 py-2 text-[13px] text-muted">No more options</div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TechMultiSelect;
