import { GenericErrorModelDto } from '~shared/api/realworld';

type ErrorsListProps = {
  errors: GenericErrorModelDto['errors'];
};

export function ErrorsList(props: ErrorsListProps) {
  const { errors } = props;
  return (
    <ul className="error-messages">
      {Object.entries(errors).map(([key, value]) =>
        value.map((e) => (
          <li key={e}>
            That {key} {e}
          </li>
        )),
      )}
    </ul>
  );
}
