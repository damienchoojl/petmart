export default function ItemCard({ item }) {
  return (
    <div>
      <p>
        <strong>{item.title}</strong>
      </p>
      <img width="30%" src={item.image1} />
    </div>
  );
}
