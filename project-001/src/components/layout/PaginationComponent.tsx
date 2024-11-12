import React from "react";
import { IconButton, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { PaginationProps } from "../../types/users";

export const SimplePagination: React.FC<PaginationProps> = ({
  page,
  limit,
  total,
  next,
  prev,
  setLimit,
  setPage,
}) => {
  const [active, setActive] = React.useState(1);

  return (
    <div className="flex justify-center items-center gap-8 w-full">
      <IconButton
        size="sm"
        variant="outlined"
        onClick={prev}
        disabled={active === 1}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      <Typography color="gray" className="font-normal">
        Page <strong className="text-gray-900">{active}</strong> of{" "}
        <strong className="text-gray-900">10</strong>
      </Typography>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={next}
        disabled={active === 10}
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>
  );
};
