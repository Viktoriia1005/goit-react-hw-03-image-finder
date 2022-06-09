import s from './ImageGallery.module.css';

export default function ImageGallery({ data, onOpenModal }) {
  return (
    <ul className={s.ImageGallery}>
      {data.map(image => (
        <li
          className={s.GalleryItem}
          key={image.id}
          onClick={() => {
            onOpenModal(image);
          }}
        >
          <img
            className={s.ImageGalleryItemImage}
            src={image.webformatURL}
            alt={image.tags}
          />
        </li>
      ))}
    </ul>
  );
}
