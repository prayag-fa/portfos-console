import { useState } from 'react';

import {
  AlertTriangle,
  Check,
  ChevronRight,
  Info,
  Lock,
  Mail,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Trash2,
  User
} from 'lucide-react';

import Badge from './Badge';
import Button from './Button';
import Card from './Card';
import {
  Form,
  FormActions,
  FormDescription,
  FormError,
  FormField,
  FormGroup,
  FormLabel
} from './Form';
import Input from './Input';
import Modal from './Modal';

const ComponentLibrary = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowModal(true);
    }
  };

  return (
    <div className='mx-auto max-w-6xl space-y-8 p-6'>
      <div className='text-center'>
        <h1 className='mb-2 text-3xl font-bold text-gray-900'>Component Library</h1>
        <p className='text-gray-600'>A comprehensive collection of reusable UI components</p>
      </div>

      {/* Button Examples */}
      <Card title='Button Components' subtitle='Various button styles and states'>
        <div className='space-y-6'>
          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Button Variants</h4>
            <div className='flex flex-wrap gap-3'>
              <Button variant='primary' icon={Plus}>
                Primary
              </Button>
              <Button variant='secondary' icon={Settings}>
                Secondary
              </Button>
              <Button variant='success' icon={Check}>
                Success
              </Button>
              <Button variant='danger' icon={Trash2}>
                Danger
              </Button>
              <Button variant='ghost' icon={Info}>
                Ghost
              </Button>
            </div>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Button Sizes</h4>
            <div className='flex flex-wrap items-center gap-3'>
              <Button size='sm' icon={Plus}>
                Small
              </Button>
              <Button size='md' icon={Plus}>
                Medium
              </Button>
              <Button size='lg' icon={Plus}>
                Large
              </Button>
            </div>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Button States</h4>
            <div className='flex flex-wrap gap-3'>
              <Button icon={RefreshCw} loading>
                Loading
              </Button>
              <Button disabled>Disabled</Button>
              <Button icon={ChevronRight} iconPosition='right'>
                Right Icon
              </Button>
            </div>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Icon Only Buttons</h4>
            <div className='flex flex-wrap gap-3'>
              <Button icon={Plus} title='Add new item' />
              <Button icon={Trash2} variant='danger' title='Delete item' />
              <Button icon={Settings} variant='secondary' title='Settings' />
            </div>
          </div>
        </div>
      </Card>

      {/* Input Examples */}
      <Card title='Input Components' subtitle='Form inputs with various configurations'>
        <div className='space-y-6'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <Input
              label='Username'
              name='username'
              value={formData.username}
              onChange={handleInputChange}
              icon={User}
              placeholder='Enter your username'
              required
              error={errors.username}
            />

            <Input
              label='Email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleInputChange}
              icon={Mail}
              placeholder='Enter your email'
              required
              error={errors.email}
            />

            <Input
              label='Password'
              name='password'
              type='password'
              value={formData.password}
              onChange={handleInputChange}
              icon={Lock}
              placeholder='Enter your password'
              showPasswordToggle
              required
              error={errors.password}
            />

            <Input label='Search' placeholder='Search items...' icon={Search} iconPosition='left' />
          </div>

          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Input Sizes</h4>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <Input label='Small Input' placeholder='Small size' size='sm' icon={User} />
              <Input label='Medium Input' placeholder='Medium size' size='md' icon={User} />
              <Input label='Large Input' placeholder='Large size' size='lg' icon={User} />
            </div>
          </div>
        </div>
      </Card>

      {/* Badge Examples */}
      <Card title='Badge Components' subtitle='Status indicators and labels'>
        <div className='space-y-6'>
          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Badge Variants</h4>
            <div className='flex flex-wrap gap-3'>
              <Badge variant='default'>Default</Badge>
              <Badge variant='primary'>Primary</Badge>
              <Badge variant='success'>Success</Badge>
              <Badge variant='warning'>Warning</Badge>
              <Badge variant='danger'>Danger</Badge>
              <Badge variant='info'>Info</Badge>
            </div>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Status Badges</h4>
            <div className='flex flex-wrap gap-3'>
              <Badge variant='completed' showDot>
                Completed
              </Badge>
              <Badge variant='in_progress' showDot>
                In Progress
              </Badge>
              <Badge variant='failed' showDot>
                Failed
              </Badge>
              <Badge variant='skipped' showDot>
                Skipped
              </Badge>
            </div>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Badge Sizes</h4>
            <div className='flex flex-wrap items-center gap-3'>
              <Badge size='sm' variant='primary'>
                Small
              </Badge>
              <Badge size='md' variant='primary'>
                Medium
              </Badge>
              <Badge size='lg' variant='primary'>
                Large
              </Badge>
            </div>
          </div>

          <div>
            <h4 className='mb-3 text-sm font-medium text-gray-700'>Badges with Icons</h4>
            <div className='flex flex-wrap gap-3'>
              <Badge variant='success' icon={Check}>
                Success
              </Badge>
              <Badge variant='danger' icon={AlertTriangle}>
                Error
              </Badge>
              <Badge variant='info' icon={Info}>
                Info
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Card Examples */}
      <Card title='Card Components' subtitle='Layout containers with various configurations'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          <Card title='Basic Card' subtitle='Simple card with title and content' padding='md'>
            <p className='text-gray-600'>This is a basic card with default styling.</p>
          </Card>

          <Card
            title='Card with Footer'
            subtitle='Card with action buttons'
            footer={
              <>
                <Button variant='secondary' size='sm'>
                  Cancel
                </Button>
                <Button variant='primary' size='sm'>
                  Save
                </Button>
              </>
            }
          >
            <p className='text-gray-600'>This card has a footer with action buttons.</p>
          </Card>

          <Card
            header={
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900'>Custom Header</h3>
                  <p className='text-sm text-gray-600'>With custom content</p>
                </div>
                <Button icon={Settings} size='sm' />
              </div>
            }
            padding='lg'
          >
            <p className='text-gray-600'>This card has a custom header with a button.</p>
          </Card>
        </div>
      </Card>

      {/* Form Example */}
      <Card title='Form Components' subtitle='Complete form with validation'>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <FormField>
              <FormLabel htmlFor='username' required>
                Username
              </FormLabel>
              <Input
                id='username'
                name='username'
                value={formData.username}
                onChange={handleInputChange}
                icon={User}
                placeholder='Enter your username'
                error={errors.username}
              />
              <FormError>{errors.username}</FormError>
            </FormField>

            <FormField>
              <FormLabel htmlFor='email' required>
                Email
              </FormLabel>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                icon={Mail}
                placeholder='Enter your email'
                error={errors.email}
              />
              <FormError>{errors.email}</FormError>
            </FormField>

            <FormField>
              <FormLabel htmlFor='password' required>
                Password
              </FormLabel>
              <Input
                id='password'
                name='password'
                type='password'
                value={formData.password}
                onChange={handleInputChange}
                icon={Lock}
                placeholder='Enter your password'
                showPasswordToggle
                error={errors.password}
              />
              <FormError>{errors.password}</FormError>
              <FormDescription>Password must be at least 8 characters long</FormDescription>
            </FormField>
          </FormGroup>

          <FormActions>
            <Button variant='secondary' type='button'>
              Cancel
            </Button>
            <Button variant='primary' type='submit'>
              Submit Form
            </Button>
          </FormActions>
        </Form>
      </Card>

      {/* Modal Example */}
      <Card title='Modal Component' subtitle='Overlay dialogs and popups'>
        <div className='space-y-4'>
          <p className='text-gray-600'>Click the button below to open a modal dialog.</p>
          <Button onClick={() => setShowModal(true)} icon={Info}>
            Open Modal
          </Button>
        </div>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title='Example Modal'
        size='md'
        footer={
          <>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant='primary' onClick={() => setShowModal(false)}>
              Confirm
            </Button>
          </>
        }
      >
        <div className='space-y-4'>
          <p className='text-gray-600'>
            This is an example modal dialog. It demonstrates the modal component&apos;s features
            including:
          </p>
          <ul className='list-inside list-disc space-y-1 text-gray-600'>
            <li>Backdrop overlay with click-to-close</li>
            <li>Escape key to close</li>
            <li>Custom header and footer</li>
            <li>Different size options</li>
            <li>Accessibility features</li>
          </ul>
        </div>
      </Modal>
    </div>
  );
};

export default ComponentLibrary;
