import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { object, string } from 'yup';
import { ArticleEditor } from './ArticleEditor';

const validationSchema = object().shape({
  title: string(),
  description: string(),
  body: string(),
  tagList: string(),
});

describe('<ArticleEditor />', () => {
  const mockOnSubmit = vi.fn();

  const renderComponent = () =>
    render(
      <ArticleEditor
        validationSchema={validationSchema}
        isLoading={false}
        isError={false}
        error={null}
        onSubmit={mockOnSubmit}
      />,
    );

  it('should render the form fields', () => {
    renderComponent();

    const titleInput = screen.getByPlaceholderText('Article Title');
    const descriptionInput = screen.getByPlaceholderText(
      "What's this article about?",
    );
    const bodyTextarea = screen.getByPlaceholderText(
      'Write your article (in markdown)',
    );
    const tagsInput = screen.getByPlaceholderText('Enter tags');

    expect(titleInput).toBeDefined();
    expect(descriptionInput).toBeDefined();
    expect(bodyTextarea).toBeDefined();
    expect(tagsInput).toBeDefined();
  });

  it('should update form values when input fields change', async () => {
    renderComponent();

    const titleInput = screen.getByPlaceholderText('Article Title');
    const descriptionInput = screen.getByPlaceholderText(
      "What's this article about?",
    );
    const bodyTextarea = screen.getByPlaceholderText(
      'Write your article (in markdown)',
    );
    const tagsInput = screen.getByPlaceholderText('Enter tags');

    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(descriptionInput, 'Test Description');
    await userEvent.type(bodyTextarea, 'Test Body');
    await userEvent.type(tagsInput, 'tag1, tag2');

    expect(titleInput).toHaveProperty('value', 'Test Title');
    expect(descriptionInput).toHaveProperty('value', 'Test Description');
    expect(bodyTextarea).toHaveProperty('value', 'Test Body');
    expect(tagsInput).toHaveProperty('value', 'tag1, tag2');
  });

  it('should call onSubmit when the form is submitted', async () => {
    renderComponent();

    const publishButton = screen.getByRole('button');

    await userEvent.click(publishButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
    });
  });

  it('should display an error message when isError is true', () => {
    const mockError = {
      error: { message: 'Test error' },
    };

    render(
      <ArticleEditor
        validationSchema={validationSchema}
        isLoading={false}
        isError
        // @ts-expect-error Type '{ error: { message: string; }; }' is missing properties
        error={mockError}
        onSubmit={mockOnSubmit}
      />,
    );

    const errorComponent = screen.getByText('Test error');

    expect(errorComponent).toBeDefined();
  });

  it('should disable form when isLoading is true', () => {
    render(
      <ArticleEditor
        validationSchema={validationSchema}
        isLoading
        isError={false}
        error={null}
        onSubmit={mockOnSubmit}
      />,
    );

    const titleInput = screen.getByPlaceholderText('Article Title');
    const descriptionInput = screen.getByPlaceholderText(
      "What's this article about?",
    );
    const bodyTextarea = screen.getByPlaceholderText(
      'Write your article (in markdown)',
    );
    const tagsInput = screen.getByPlaceholderText('Enter tags');
    const publishButton = screen.getByRole('button');

    expect(titleInput).toHaveProperty('disabled');
    expect(descriptionInput).toHaveProperty('disabled');
    expect(bodyTextarea).toHaveProperty('disabled');
    expect(tagsInput).toHaveProperty('disabled');
    expect(publishButton).toHaveProperty('disabled');
  });
});
