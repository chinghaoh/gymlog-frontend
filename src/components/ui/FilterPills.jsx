export default function FilterPills({ options, active, onChange }) {
  return (
      <div className="flex gap-1.5 flex-wrap mb-4">
          {options.map(option => (
              <button
                  key={option}
                  onClick={() => onChange(option)}
                  className={`px-3.5 py-1 rounded-full text-sm border-none cursor-pointer transition-colors
                      ${active === option
                          ? 'bg-purple text-white font-semibold'
                          : 'bg-transparent text-text-secondary border-half hover:text-text-primary'
                      }`}
              >
                  {option}
              </button>
          ))}
      </div>
  )
}