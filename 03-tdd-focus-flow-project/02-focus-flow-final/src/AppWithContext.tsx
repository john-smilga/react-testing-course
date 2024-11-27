import Form from './components/Form';
import List from './components/List';
import { useFlowContext } from './FlowContext';
const AppWithContext = () => {
  const { items, handleAddItem, handleDeleteItem } = useFlowContext();
  return (
    <main className='container mx-auto p-4 max-w-6xl'>
      <h1 className='text-3xl font-bold mb-8'>Focus Flow</h1>
      <Form onSubmit={handleAddItem} />
      <List items={items} onDelete={handleDeleteItem} />
    </main>
  );
};
export default AppWithContext;
