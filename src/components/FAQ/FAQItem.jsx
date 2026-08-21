import { useRef } from 'react';

export function FAQItem({ question, answer, isOpen, onToggle, legal = false }) {
  const panelRef = useRef(null);

  return (
    <div className={`faq-item ${legal ? 'is-legal' : ''} ${isOpen ? 'is-open' : ''}`}>
      <button className="faq-item__q" aria-expanded={isOpen} onClick={onToggle}>
        {question}
        <span className="faq-item__icon" aria-hidden="true" />
      </button>
      <div
        className="faq-item__panel"
        ref={panelRef}
        style={{ maxHeight: isOpen ? panelRef.current?.scrollHeight ?? 400 : 0 }}
      >
        <div className="faq-item__panel-inner">{answer}</div>
      </div>
    </div>
  );
}
