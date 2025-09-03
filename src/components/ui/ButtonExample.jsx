import { RefreshCw, ChevronRight, Plus, Trash2, Check } from 'lucide-react';

import Button from './Button';

const ButtonExample = () => {
  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-2xl font-bold text-gray-900'>Button Component Examples</h2>

      {/* Primary Buttons */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-700'>Primary Buttons</h3>
        <div className='flex flex-wrap gap-3'>
          <Button
            icon={RefreshCw}
            onClick={() => console.log('Refresh clicked')}
            title='Refresh Data for User'
          >
            Refresh Data
          </Button>

          <Button
            icon={Plus}
            variant='primary'
            size='sm'
            onClick={() => console.log('Add clicked')}
          >
            Add New
          </Button>

          <Button
            icon={Check}
            variant='primary'
            size='lg'
            onClick={() => console.log('Save clicked')}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Icon Only Buttons */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-700'>Icon Only Buttons</h3>
        <div className='flex flex-wrap gap-3'>
          <Button
            icon={ChevronRight}
            onClick={() => console.log('View journey clicked')}
            title='View Journey'
          />

          <Button
            icon={RefreshCw}
            variant='secondary'
            onClick={() => console.log('Secondary refresh clicked')}
            title='Secondary Refresh'
          />

          <Button
            icon={Trash2}
            variant='danger'
            onClick={() => console.log('Delete clicked')}
            title='Delete Item'
          />
        </div>
      </div>

      {/* Different Variants */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-700'>Button Variants</h3>
        <div className='flex flex-wrap gap-3'>
          <Button variant='primary' icon={Plus}>
            Primary
          </Button>
          <Button variant='secondary' icon={Plus}>
            Secondary
          </Button>
          <Button variant='danger' icon={Trash2}>
            Danger
          </Button>
          <Button variant='success' icon={Check}>
            Success
          </Button>
          <Button variant='ghost' icon={Plus}>
            Ghost
          </Button>
        </div>
      </div>

      {/* Loading States */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-700'>Loading States</h3>
        <div className='flex flex-wrap gap-3'>
          <Button
            icon={RefreshCw}
            loading={true}
            onClick={() => console.log('Loading button clicked')}
          >
            Loading...
          </Button>

          <Button icon={RefreshCw} loading={true} disabled={true}>
            Disabled Loading
          </Button>
        </div>
      </div>

      {/* Icon Positions */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-gray-700'>Icon Positions</h3>
        <div className='flex flex-wrap gap-3'>
          <Button
            icon={ChevronRight}
            iconPosition='left'
            onClick={() => console.log('Left icon clicked')}
          >
            Left Icon
          </Button>

          <Button
            icon={ChevronRight}
            iconPosition='right'
            onClick={() => console.log('Right icon clicked')}
          >
            Right Icon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonExample;
