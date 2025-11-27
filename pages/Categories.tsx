import React, { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CategoryItem } from '../components/CategoryItem';
import { Modal } from '../components/ui/Modal';
import { listCategories, createCategory, CategoryRecord } from '../services/categories';
import { useAuth } from '../contexts/AuthProvider';

function colorsFor(color: string) {
  const map: Record<string, { icon: string, bg: string, wrapper: string }> = {
    blue: { icon: 'text-blue-600 dark:text-blue-300', bg: 'bg-blue-200 dark:bg-blue-900/50', wrapper: 'bg-blue-50 dark:bg-blue-900/10' },
    green: { icon: 'text-green-600 dark:text-green-300', bg: 'bg-green-200 dark:bg-green-900/50', wrapper: 'bg-green-50 dark:bg-green-900/10' },
    orange: { icon: 'text-orange-600 dark:text-orange-300', bg: 'bg-orange-200 dark:bg-orange-900/50', wrapper: 'bg-orange-50 dark:bg-orange-900/10' },
    purple: { icon: 'text-purple-600 dark:text-purple-300', bg: 'bg-purple-200 dark:bg-purple-900/50', wrapper: 'bg-purple-50 dark:bg-purple-900/10' },
    teal: { icon: 'text-teal-600 dark:text-teal-300', bg: 'bg-teal-200 dark:bg-teal-900/50', wrapper: 'bg-teal-50 dark:bg-teal-900/10' },
    indigo: { icon: 'text-indigo-600 dark:text-indigo-300', bg: 'bg-indigo-200 dark:bg-indigo-900/50', wrapper: 'bg-indigo-50 dark:bg-indigo-900/10' },
    pink: { icon: 'text-pink-600 dark:text-pink-300', bg: 'bg-pink-200 dark:bg-pink-900/50', wrapper: 'bg-pink-50 dark:bg-pink-900/10' },
  }
  return map[color] || map.blue
}

const CategoryForm: React.FC<{ onClose: () => void, type: 'expense' | 'income', onCreated: () => void }> = ({ onClose, type, onCreated }) => {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('school')
  const [color, setColor] = useState('blue')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const save = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const { error } = await createCategory({ user_id: user.id, name, icon, color, kind: type })
    if (error) setError(error.message)
    else { onCreated(); onClose() }
    setLoading(false)
  }
  return (
    <div className="space-y-4">
      <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Nome da Categoria</label>
          <input 
            type="text" 
            className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-text-light-primary dark:text-text-dark-primary" 
            placeholder="Ex: Educação" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
      </div>
      <div>
        <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-1">Ícone</label>
        <div className="grid grid-cols-6 gap-2 bg-background-light dark:bg-background-dark p-3 rounded-lg border border-border-light dark:border-border-dark">
             {['school', 'pets', 'fitness_center', 'shopping_bag', 'flight', 'wifi'].map((ic) => (
                 <button key={ic} className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center" onClick={() => setIcon(ic)}>
                     <span className="material-icons-outlined text-text-light-secondary dark:text-text-dark-secondary">{ic}</span>
                 </button>
             ))}
        </div>
      </div>
      <div>
          <label className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary mb-2">Cor da categoria</label>
          <div className="flex gap-3">
            {['blue', 'green', 'purple', 'red', 'orange', 'teal', 'indigo', 'pink'].map((c) => (
               <button key={c} className={`w-8 h-8 rounded-full hover:ring-2 ring-offset-2 ring-gray-300 dark:ring-gray-600 transition-all ${colorsFor(c).bg.split(' ')[0]}`} onClick={() => setColor(c)}></button>
            ))}
          </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex gap-3 pt-4 border-t border-border-light dark:border-border-dark mt-4">
          <Button variant="outline" fullWidth onClick={onClose}>Cancelar</Button>
          <Button fullWidth onClick={save} disabled={loading}>{loading ? 'Criando...' : `Criar ${type === 'expense' ? 'Despesa' : 'Receita'}`}</Button>
      </div>
    </div>
  )
}

const Categories: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'expense' | 'income'>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState<CategoryRecord[]>([])
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const reload = () => {
    listCategories(activeTab).then(({ data }) => setItems(data || []))
  }
  useEffect(() => { reload(); setSelectedCategoryIndex(0) }, [activeTab])
  const currentCategories = items
  const currentSubCategories: string[] = []

  return (
    <div className="flex flex-col h-full space-y-6 pb-10">
      <Header title=" " />

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-light-primary dark:text-text-dark-primary">Gerenciar Categorias</h1>
        <Button variant="primary" className="shadow-md" onClick={() => setIsModalOpen(true)}>
           <span className="material-icons text-lg mr-2">add</span>
           Nova Categoria
        </Button>
      </div>

      {/* Tabs */}
      <div>
        <div className="inline-flex bg-white dark:bg-surface-dark rounded-lg p-1 space-x-1 shadow-sm border border-gray-100 dark:border-gray-700">
          <button 
            onClick={() => { setActiveTab('expense'); setSelectedCategoryIndex(0); }}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'expense' 
                ? 'bg-purple-100 dark:bg-purple-900/30 text-primary' 
                : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Despesas
          </button>
          <button 
            onClick={() => { setActiveTab('income'); setSelectedCategoryIndex(0); }}
            className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'income' 
                ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400' 
                : 'text-text-light-secondary dark:text-text-dark-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Receitas
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Lista de Categorias */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">
                  {activeTab === 'expense' ? 'Categorias de Despesa' : 'Categorias de Receita'}
              </h2>
              <button className="text-sm text-primary font-medium flex items-center space-x-1 hover:underline" onClick={() => setIsModalOpen(true)}>
                <span className="material-icons text-base">add</span>
                <span>Adicionar</span>
              </button>
            </div>
            <div className="space-y-4">
              {currentCategories.map((cat, i) => (
                <div key={i} onClick={() => setSelectedCategoryIndex(i)} className={`border-2 rounded-lg transition-all ${selectedCategoryIndex === i ? 'border-primary/50' : 'border-transparent'}`}>
                    <CategoryItem
                        name={cat.name}
                        icon={cat.icon}
                        colors={colorsFor(cat.color)}
                    />
                </div>
              ))}
            </div>
          </Card>

          {/* Subcategorias */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary">Subcategorias</h2>
              <span className="text-xs text-text-light-secondary dark:text-text-dark-secondary hidden sm:inline">Arraste para reordenar dentro de cada categoria</span>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-text-light-secondary dark:text-text-dark-secondary mb-2 flex items-center space-x-2">
                  {currentCategories[selectedCategoryIndex] && (
                    <span className={`material-icons ${colorsFor(currentCategories[selectedCategoryIndex].color).icon} text-xl`}>
                        {currentCategories[selectedCategoryIndex].icon}
                    </span>
                  )}
                  <span className="text-text-light-primary dark:text-text-dark-primary">
                      {currentCategories[selectedCategoryIndex]?.name || ''}
                  </span>
                </h3>
                
                {currentSubCategories.length > 0 ? (
                    <div className="ml-2 space-y-2 pl-4 border-l-2 border-border-light dark:border-border-dark">
                    {currentSubCategories.map((sub, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-grab active:cursor-grabbing group transition-colors">
                        <div className="flex items-center space-x-3 text-text-light-primary dark:text-text-dark-primary">
                            <span className="material-icons text-gray-400 group-hover:text-gray-600 transition-colors">drag_indicator</span>
                            <p>{sub}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="text-gray-400 hover:text-primary"><span className="material-icons text-sm">edit</span></button>
                            <button className="text-gray-400 hover:text-red-500"><span className="material-icons text-sm">delete</span></button>
                        </div>
                        </div>
                    ))}
                    </div>
                ) : (
                    <div className="ml-6 py-4 text-sm text-text-light-secondary dark:text-text-dark-secondary italic">
                        Nenhuma subcategoria cadastrada.
                    </div>
                )}
                 <div className="mt-3 ml-6">
                     <button className="text-sm text-primary font-medium hover:underline flex items-center">
                         <span className="material-icons text-sm mr-1">add</span> Adicionar subcategoria
                     </button>
                 </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Painel lateral explicativo */}
        <div className="lg:col-span-1">
          <Card className="p-6 text-center sticky top-24">
            <div className="mb-4 flex justify-center">
                {/* Ícone ilustrativo substituindo a imagem que poderia ter sobreposição de texto */}
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                     <span className="material-icons text-6xl text-gray-400 dark:text-gray-600">low_priority</span>
                </div>
            </div>
            <h3 className="text-lg font-semibold text-text-light-primary dark:text-text-dark-primary mb-2">Organize suas Finanças</h3>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mb-4">
                Use as alças <span className="material-icons align-middle text-sm bg-gray-200 dark:bg-gray-700 rounded px-1">drag_indicator</span> para reordenar suas categorias e subcategorias de forma intuitiva.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                Dica: Você pode criar quantas subcategorias precisar para detalhar melhor seus relatórios.
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Nova Categoria de ${activeTab === 'expense' ? 'Despesa' : 'Receita'}`}
      >
          <CategoryForm onClose={() => setIsModalOpen(false)} type={activeTab} onCreated={reload} />
      </Modal>

    </div>
  );
};

export default Categories;
