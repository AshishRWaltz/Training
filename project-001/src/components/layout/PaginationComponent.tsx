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
  getItemProps,
}) => {
  const [active, setActive] = React.useState(page);

  return (
    <div className="flex justify-center items-center gap-8 w-full">
      <IconButton
        size="sm"
        variant="outlined"
        onClick={prev}
        disabled={active === 0}
      >
        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
      <Typography color="gray" className="font-normal">
        Page <strong className="text-gray-900">{page}</strong> of{" "}
        <strong className="text-gray-900">{11}</strong>
      </Typography>
      <IconButton
        size="sm"
        variant="outlined"
        onClick={next}
        disabled={active === 11}
      >
        <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
      </IconButton>
    </div>
  );
};
