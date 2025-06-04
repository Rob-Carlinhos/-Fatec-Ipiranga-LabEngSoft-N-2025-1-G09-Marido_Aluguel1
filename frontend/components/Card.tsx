interface Props {
  title: string;
  description: string;
}

export default function Card({ title, description }: Props) {
  return (
    <div className="bg-white bg-opacity-80 shadow-lg rounded-2xl p-6 w-72 text-center hover:shadow-xl hover:scale-105 transition-all duration-300 backdrop-blur-md">
      <h2 className="text-xl font-semibold text-orange-600 mb-2">{title}</h2>
      <p className="text-gray-700 text-sm">{description}</p>
    </div>
  );
}