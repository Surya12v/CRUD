import FormBuilder from '../components/FormBuilder/FormBuilder';
import DynamicForm from '../components/DynamicForm/DynamicForm';
import UserForm from '../components/UserForm/UserForm';
import DynamicTable from '../components/Table/Table';

export const routes = [
  {
    path: '/',
    element: <FormBuilder />,
  },
  {
    path: '/forms',
    children: [
      {
        path: '',
        element: <FormBuilder />,
      },
      {
        path: ':id/edit',
        element: <FormBuilder />,
      }
    ]
  },
  {
    path: '/dynamic/:collectionName',
    element: <DynamicForm />,
  },
  {
    path: '/users',
    element: <UserForm />,
  },
  {
    path: '/table/:collectionName',
    element: <DynamicTable />,
  }
];
