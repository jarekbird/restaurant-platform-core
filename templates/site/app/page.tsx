import { readFileSync } from 'fs';
import { join } from 'path';

export default function HomePage() {
  // Read local data files
  const configPath = join(process.cwd(), 'data', 'config.json');
  const menuPath = join(process.cwd(), 'data', 'menu.json');

  let config;
  let menu;

  try {
    const configContent = readFileSync(configPath, 'utf-8');
    config = JSON.parse(configContent);
  } catch {
    config = null;
  }

  try {
    const menuContent = readFileSync(menuPath, 'utf-8');
    menu = JSON.parse(menuContent);
  } catch {
    menu = null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">
        {config?.name || 'Restaurant'}
      </h1>
      {menu && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Menu</h2>
          {menu.categories?.map((category: { id: string; name: string; items?: Array<{ id: string; name: string; price: number }> }) => (
            <div key={category.id} className="mb-6">
              <h3 className="text-xl font-semibold">{category.name}</h3>
              {category.items?.map((item: { id: string; name: string; price: number }) => (
                <div key={item.id} className="ml-4">
                  <p>{item.name} - ${item.price}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

