import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store";
import { formatAmount } from "../../utils/commonHelper";

interface InvoiceAmountSummaryProps {
  total: number,
  discountedTotal: number;
  currency: string;
  className?: string
}
const InvoiceAmountSummary = (props: InvoiceAmountSummaryProps) => {
  const { total, discountedTotal, currency, className = '' } = props;

  const { t } = useTranslation();
  const isRTL = useAppSelector(state => state.language.isRTL)

  return (
    <div className={`flex flex-col ${className}`}>
      <div className={`flex border-b border-grey justify-between pb-1 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="capitalize">{t("subtotal")}</span>
        <span>{formatAmount(total, currency)}</span>
      </div>
      {total !== discountedTotal && (
        <div className={`flex border-b border-grey justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="capitalize">{t("discount")}</span>
          <span>{formatAmount(total - discountedTotal, currency)}</span>
        </div>
      )}
      <div className={`flex justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <span className="capitalize font-semibold">{t("total")}</span>
        <span className="font-semibold">{formatAmount(discountedTotal, currency)}</span>
      </div>
    </div>
  );
};

export default InvoiceAmountSummary;
