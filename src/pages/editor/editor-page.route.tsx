import { createElement, lazy } from 'react'
import { LoaderFunctionArgs, RouteObject } from 'react-router-dom'
import { compose, withSuspense } from '~shared/lib/react'
import { EditorPageSkeleton } from './editor-page.skeleton'

const editorCreatePageLoader = (args: LoaderFunctionArgs) =>
  import('./editor-page.model').then((module) =>
    module.EditorLoader.editorCreatePage(args),
  )

const editorUpdatePageLoader = (args: LoaderFunctionArgs) =>
  import('./editor-page.model').then((module) =>
    module.EditorLoader.editorUpdatePage(args),
  )

const CreateEditorPage = lazy(() =>
  import('./editor-page.ui').then((module) => ({
    default: module.CreateEditorPage,
  })),
)

const UpdateEditorPage = lazy(() =>
  import('./editor-page.ui').then((module) => ({
    default: module.UpdateEditorPage,
  })),
)

const enhance = compose((component) =>
  withSuspense(component, { FallbackComponent: EditorPageSkeleton }),
)

export const editorPageRoute: RouteObject = {
  path: 'editor',
  children: [
    {
      index: true,
      element: createElement(enhance(CreateEditorPage)),
      loader: editorCreatePageLoader,
    },
    {
      path: ':slug',
      element: createElement(enhance(UpdateEditorPage)),
      loader: editorUpdatePageLoader,
    },
  ],
}
