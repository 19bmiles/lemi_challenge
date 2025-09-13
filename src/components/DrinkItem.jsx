export default function DrinkItem({ drink, checked, onToggle }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="w-6 h-6 text-purple-600 rounded focus:ring-purple-500 mt-1"
          id={`drink-${drink.id}`}
        />
        <label htmlFor={`drink-${drink.id}`} className="cursor-pointer flex-1">
          <h3 className="font-medium text-gray-800">{drink.name}</h3>
          <span className="text-sm text-gray-500">
            {drink.type === 'beer' ? '🍺' : '🍹'} {drink.type}
          </span>
          {drink.description && (
            <p className="text-xs text-gray-400 mt-1">{drink.description}</p>
          )}
        </label>
      </div>
    </div>
  );
}