type Props = Readonly<{
  productId: string;
  navigate: (path: string) => void;
}>;

export default function ProductReviewsButton({ productId, navigate }: Props) {
  return (
    <div className="border-t border-gray-200 pt-6">
      <button
        onClick={() => navigate(`/reviews/${productId}`)}
        className="w-full bg-yellow-400 text-gray-900 font-semibold py-3 rounded-lg shadow hover:bg-yellow-500 transition flex items-center justify-center gap-2"
      >
        <i className="fa-solid fa-star"></i>
        View Reviews & Ratings
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </div>
  );
}
