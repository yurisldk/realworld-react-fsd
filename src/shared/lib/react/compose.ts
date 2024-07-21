import { ComponentType } from 'react'

export function compose<Props extends object>(
  ...hocs: Array<(component: ComponentType<Props>) => ComponentType<Props>>
): (component: ComponentType<Props>) => ComponentType<Props> {
  return (component: ComponentType<Props>) =>
    hocs.reduceRight((wrapped, hoc) => hoc(wrapped), component)
}
