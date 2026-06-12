import type { FormData } from "../../App.tsx";

type Props = {
  formData: FormData;
  updateForm: (data: Partial<FormData>) => void;
  nextStep: () => void;
};

const formInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export const Step1_UserInfo = ({ formData, updateForm, nextStep }: Props) => {
  const sexOptions = ["Feminino", "Masculino", "Outro", "Prefiro não dizer"];

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <h2 className="text-2xl font-bold text-center">Sobre Você</h2>

      {formInput({
        label: "Idade",
        value: formData.age,
        onChange: (val) => updateForm({ age: val }),
      })}

      <fieldset>
        <legend className="block text-sm font-medium text-gray-300 mb-1">
          Sexo
        </legend>
        <div className="flex flex-wrap gap-2 pt-2">
          {sexOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-2 p-3 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
            >
              <input
                type="radio"
                name="sex"
                value={option}
                checked={formData.sex === option}
                onChange={() => updateForm({ sex: option })}
                className="form-radio text-indigo-500 bg-gray-800 border-gray-600 focus:ring-indigo-500"
              />
              <span className="text-gray-200">{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {formInput({
        label: "Localização (Cidade/Estado)",
        value: formData.location,
        onChange: (val) => updateForm({ location: val }),
      })}
      {formInput({
        label: "Instituição (Opcional)",
        value: formData.institution,
        onChange: (val) => updateForm({ institution: val }),
      })}

      {/* 4. BOTÕES "VOLTAR" E "PRÓXIMO" ADICIONADOS */}
      <div className="flex justify-between pt-4">
        <button
          type="button"
          className="bg-gray-600 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-500 transition-all"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 transition-all"
        >
          Próximo
        </button>
      </div>
    </form>
  );
};
