import s from './Button.module.css';

function Button({ onLoadMore }) {
  return (
    <button onClick={onLoadMore} className={s.Button} type="button">
      Load more
    </button>
  );
}

export default Button;
