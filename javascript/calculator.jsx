import { createRoot, useState, useEffect } from "@wordpress/element";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { money } from "./utils";
import { NumericFormat } from "react-number-format";
import CountUp from "react-countup";
import qs from "qs";

const Calc = ({ data, url }) => {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const { handleSubmit, register, control, setValue, getValues } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      text: "",
      distance: 0,
      robots: data.map((r, index) => {
        return {
          ...r,
          count: 0,
          hours: 2,
          days: 0,
          photo: 0,
        };
      }),
    },
  });

  const { fields } = useFieldArray({
    name: "robots",
    control,
  });

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }, [success]);

  const onSubmit = async (values) => {
    setSuccess(false);
    setError("");
    setLoading(true);
    const { robots, distance } = values;
    const { totalRentPrice, totalSalePrice } = getTotalPrices(robots, distance);
    const robotsWithPrices = [...robots].map((data) => {
      const rentPrice = getRentPrice(data);
      const salePrice = getSalePrice(data);
      return {
        ...data,
        rentPrice: money(rentPrice),
        salePrice: money(salePrice),
      };
    });

    const data = {
      ...values,
      robots: robotsWithPrices,
      totalRentPrice: money(totalRentPrice),
      totalSalePrice: money(totalSalePrice),
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: qs.stringify({ data: JSON.stringify(data) }),
      });

      const { success } = await response.json();
      if (success) {
        setSuccess(true);
        if (window.ym !== undefined) {
          window.ym(24343222, "reachGoal", "raschet-cen");
        }
      } else {
        throw new Error("Что-то пошло не так");
      }
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const increasePhoto = (index) => {
    const data = getValues(`robots.${index}.photo`);
    setValue(`robots.${index}.photo`, (parseInt(data) + 100).toString());
  };
  const decreasePhoto = (index) => {
    const data = getValues(`robots.${index}.photo`);
    if (parseInt(data) >= 100) {
      setValue(`robots.${index}.photo`, (parseInt(data) - 100).toString());
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={"calc_form"}>
      <div className="grid gap-6 lg:grid-cols-3">
        {fields.map((robot, index) => {
          return (
            <div
              key={robot.id}
              className="overflow-hidden rounded-lg border border-solid shadow-lg"
            >
              <div className="relative flex max-h-[300px] min-h-[300px] w-full items-center justify-center border-b border-solid bg-gradient-to-b from-slate-300 to-slate-50">
                <img
                  src={robot.image}
                  alt={robot.title}
                  className="max-h-[300px] max-w-[300px]"
                />
                <a
                  href={robot.link}
                  className="hover:bg-secondary absolute -bottom-6 right-5 flex items-center justify-center rounded-full border border-solid bg-white p-3 shadow-lg"
                  target="_blank"
                >
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 320 512"
                    height="2em"
                    width="2em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path>
                  </svg>
                </a>
              </div>
              <div className="p-5">
                <h3>{robot.title}</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-secondary mb-2 block">
                      Количество
                    </label>
                    <Controller
                      control={control}
                      name={`robots.${index}.count`}
                      render={({ field: { ref, onChange, name, value } }) => (
                        <NumericFormat
                          getInputRef={ref}
                          name={name}
                          value={value}
                          onChange={onChange}
                          valueIsNumericString
                          allowNegative={false}
                          decimalScale={0}
                          placeholder="0"
                          isAllowed={(v) =>
                            !v.floatValue || v.floatValue < 1000
                          }
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-secondary mb-2 block">Дней</label>
                    <Controller
                      control={control}
                      name={`robots.${index}.days`}
                      render={({ field: { ref, onChange, name, value } }) => (
                        <NumericFormat
                          getInputRef={ref}
                          name={name}
                          value={value}
                          onChange={onChange}
                          valueIsNumericString
                          allowNegative={false}
                          decimalScale={0}
                          placeholder="0"
                          isAllowed={(v) =>
                            !v.floatValue || v.floatValue < 1000
                          }
                        />
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-secondary mb-2 block">
                      Часов/день
                    </label>
                    <select {...register(`robots.${index}.hours`)}>
                      <option value="2">До 2-x часов</option>
                      <option value="4">До 4-x часов</option>
                      <option value="8">До 8-ми часов</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <label className="text-secondary col-span-2 flex items-center">
                    Печать фотографий (10х15 см), шт.
                  </label>
                  <div className="flex items-center">
                    {robot?.photo_price ? (
                      <>
                        {" "}
                        <button
                          type="button"
                          className="border-none bg-transparent px-2 text-xl lg:cursor-pointer"
                          onClick={() => decreasePhoto(index)}
                        >
                          -
                        </button>
                        <Controller
                          control={control}
                          name={`robots.${index}.photo`}
                          render={({
                            field: { ref, onChange, name, value },
                          }) => (
                            <NumericFormat
                              getInputRef={ref}
                              name={name}
                              value={value}
                              onChange={onChange}
                              className="!mb-0"
                              valueIsNumericString
                              allowNegative={false}
                              decimalScale={0}
                              placeholder="0"
                              disabled
                              isAllowed={(v) =>
                                !v.floatValue || v.floatValue < 1000000
                              }
                            />
                          )}
                        />
                        <button
                          type="button"
                          className="border-none bg-transparent px-2 text-xl lg:cursor-pointer"
                          onClick={() => increasePhoto(index)}
                        >
                          +
                        </button>
                      </>
                    ) : (
                      <div className="flex h-[33px] items-center">
                        недоступна
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <RobotPrices control={control} name={`robots.${index}`} />
            </div>
          );
        })}
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-solid p-5 shadow-lg">
        <h3>Расстояние от Москвы, км</h3>
        <Controller
          control={control}
          name="distance"
          render={({ field: { ref, onChange, name, value } }) => (
            <NumericFormat
              getInputRef={ref}
              name={name}
              value={value}
              onChange={onChange}
              valueIsNumericString
              allowNegative={false}
              decimalScale={0}
              placeholder="0"
              isAllowed={(v) => !v.floatValue || v.floatValue < 100000}
            />
          )}
        />
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-solid shadow-lg">
        <h3 className="bg-secondary px-5 py-2 !text-white">Итого</h3>
        <div className="px-5 pb-5 pt-3">
          <div className="grid gap-6 lg:grid-cols-2">
            <TotalPrices control={control} />
            <div>
              {success && <div>ВАШ ЗАПРОС ОТПРАВЛЕН</div>}
              {!!error && <div>{error}</div>}
              {!success && (
                <div>
                  <div>
                    <div>
                      <label>Имя:</label>
                      <input
                        {...register("name", {
                          required: true,
                        })}
                        type="text"
                        placeholder="Имя*"
                      />
                    </div>
                    <div>
                      <label>Телефон:</label>
                      <input
                        {...register("phone", {
                          required: true,
                        })}
                        type="text"
                        placeholder="Телефон*"
                      />
                    </div>
                    <div>
                      <label>Email:</label>
                      <input
                        {...register("email", {
                          required: true,
                        })}
                        type="email"
                        placeholder="Email*"
                      />
                    </div>
                  </div>
                  <div>
                    <label>Комментарий</label>
                    <textarea
                      {...register("text")}
                      rows="7"
                      placeholder="Комментарий"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-secondary rounded-lg border-none px-4 py-2 text-lg text-white lg:cursor-pointer"
                    >
                      {loading ? "Подождите..." : "Отправить запрос"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

const renderCalc = () => {
  const calc = document.getElementById("robot-calc-react");
  if (!!calc && calc.dataset.cfs && calc.dataset.url) {
    try {
      const root = createRoot(calc);
      root.render(
        <Calc data={JSON.parse(calc.dataset.cfs)} url={calc.dataset.url} />
      );
    } catch (error) {
      console.error(error);
    }
  }
};

const RobotPrices = ({ control, name }) => {
  const data = useWatch({ control, name });
  const rentPrice = getRentPrice(data);
  const salePrice = getSalePrice(data);
  return (
    <div className="mt-4 border-t border-solid bg-slate-50 p-5 text-base">
      <div className="flex items-center gap-4">
        <span>Аренда от</span>
        <span className="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
        <span>
          <CountUp
            className="text-secondary font-bold"
            end={rentPrice}
            separator=" "
            suffix=" ₽"
            decimal=","
            decimals={2}
            duration={0.2}
          />
        </span>
      </div>
      <div className="mt-1 flex items-center gap-4">
        <span>Покупка от</span>
        <span className="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
        <span>
          <CountUp
            className="text-secondary font-bold"
            end={salePrice}
            separator=" "
            suffix=" ₽"
            decimal=","
            decimals={2}
            duration={0.2}
          />
        </span>
      </div>
    </div>
  );
};

const TotalPrices = ({ control }) => {
  const { robots, distance } = useWatch({ control });

  const {
    totalRentPrice,
    totalSalePrice,
    additionalPriceForKm,
    additionalPriceForStaff,
  } = getTotalPrices(robots, distance);

  return (
    <div>
      <div className="relative mt-5 rounded-lg border border-solid !border-gray-700">
        <div className="bg-primary absolute -top-4 left-2 rounded-lg px-2 text-lg text-white">
          Покупка
        </div>
        <div className="flex items-center gap-4 p-3 text-base">
          <span>Цена от</span>
          <span className="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
          <span>
            <CountUp
              className="text-secondary font-bold"
              end={totalSalePrice}
              separator=" "
              suffix=" ₽"
              decimal=","
              decimals={2}
              duration={0.2}
            />
          </span>
        </div>
      </div>

      <div className="relative mt-8 rounded-lg border border-solid !border-gray-700">
        <div className="bg-primary absolute -top-4 left-2 rounded-lg px-2 text-lg text-white">
          Аренда{" "}
          {distance ? `(${parseInt(distance)} км от Москвы)` : "по Москве"}
        </div>
        <div className="p-3">
          <div className="flex items-center gap-4 text-base">
            <span>Цена от</span>
            <span className="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
            <span>
              <CountUp
                className="text-secondary font-bold"
                end={totalRentPrice}
                separator=" "
                suffix=" ₽"
                decimal=","
                decimals={2}
                duration={0.2}
              />
            </span>
          </div>
          {(!!additionalPriceForKm || !!additionalPriceForStaff) && (
            <div className="text-base">
              <span className="text-secondary">Включая</span>
              <div className="flex items-center gap-4 text-base">
                <span className="xs:hidden lg:inline">Стоимость логистики</span>
                <span className="lg:hidden">Логистика</span>
                <span className="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
                <span>
                  <CountUp
                    className="text-secondary font-bold"
                    end={additionalPriceForKm}
                    separator=" "
                    suffix=" ₽"
                    decimal=","
                    decimals={2}
                    duration={0.2}
                  />
                </span>
              </div>
              <div className="flex items-center gap-4 text-base">
                <span className="xs:hidden lg:inline">Стоимость персонала</span>
                <span className="lg:hidden">Персонал</span>
                <span className="block h-[6px] flex-1 border-b-4 border-dotted border-black"></span>
                <span>
                  <CountUp
                    className="text-secondary font-bold"
                    end={additionalPriceForStaff}
                    separator=" "
                    suffix=" ₽"
                    decimal=","
                    decimals={2}
                    duration={0.2}
                  />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getTotalPrices = (robots, distance) => {
  const distanceKm = parseFloat(distance);
  return robots.reduce(
    (acc, data) => {
      const rentPrice = getRentPrice(data, distance);
      const salePrice = getSalePrice(data);
      const countInt = parseInt(data.count) || 0;

      const { staff_price, logistic_price } = data;

      let additionalPriceForKm = 0;
      let additionalPriceForStaff = 0;

      if (rentPrice > 0 && logistic_price && distanceKm > 0) {
        additionalPriceForKm =
          (parseFloat(logistic_price) * distanceKm + 3000) * countInt;
      }

      if (rentPrice > 0 && staff_price && distanceKm > 0) {
        additionalPriceForStaff +=
          parseFloat(staff_price) * distanceKm * countInt;
      }

      acc.totalRentPrice +=
        rentPrice + additionalPriceForKm + additionalPriceForStaff;
      acc.totalSalePrice += salePrice;
      acc.additionalPriceForKm += additionalPriceForKm;
      acc.additionalPriceForStaff += additionalPriceForStaff;
      return acc;
    },
    {
      totalRentPrice: 0,
      totalSalePrice: 0,
      additionalPriceForKm: 0,
      additionalPriceForStaff: 0,
    }
  );
};

const getSalePrice = (data) => {
  let { price, count, sconto_by_items_sale } = data;
  const countInt = parseInt(count) || 0;
  const priceInt = parseInt(price) || 0;
  const basePrice = priceInt * countInt;
  const scontoByItemsRange = getRange(sconto_by_items_sale, countInt);
  price = basePrice - (basePrice * scontoByItemsRange) / 100;

  return price;
};

const getRentPrice = (data) => {
  const {
    count,
    hours,
    days,
    photo,
    sconto_by_days_rent,
    sconto_by_items_rent,
    photo_price,
  } = data;
  const countInt = parseInt(count) || 0;
  const daysInt = parseInt(days) || 0;
  const photoInt = parseInt(photo) || 0;
  const basePrice = data[`rent_${hours}`] ?? 0;
  let price = 0;

  if (daysInt > 0 && countInt > 0) {
    price = basePrice * countInt * daysInt;
    const scontoByDaysRange = getRange(sconto_by_days_rent, daysInt);
    const scontoByItemsRange = getRange(sconto_by_items_rent, countInt);
    const totalSconto = scontoByDaysRange + scontoByItemsRange;
    price = price - (price * totalSconto) / 100;
    if (photo_price) {
      price += parseFloat(photo_price) * photoInt;
    }
  }

  return price;
};

const getRange = (arrayOfRanges = [], num) => {
  const rangeIndex = arrayOfRanges.findIndex((rangeData) => {
    const range = rangeData?.range ?? "";
    let [from, to] = range.trim().split("-");
    if (!from || !to) return false;
    from = parseInt(from);
    to = parseInt(to);
    if (num >= from && num < to) return true;
    return false;
  });

  if (rangeIndex === -1) return 0;

  return parseInt(arrayOfRanges[rangeIndex].sconto ?? 0) ?? 0;
};

export default renderCalc;
