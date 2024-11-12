import { Loading } from "notiflix/build/notiflix-loading-aio";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

Loading.init({
  svgColor: "#0b243f",
});

Notify.init({
  clickToClose: true,
  position: "right-top",
  timeout: 5000,
  messageMaxLength: 1500,
  showOnlyTheLastOne: true,
});

export const Spinner = {
  show: () => {
    return Loading.circle();
  },
  hide: () => {
    return Loading.remove();
  },
};

export const Alert = {
  success: (_msg = "") => {
    return Notify.success(_msg ? _msg : "Success");
  },
  warning: (_msg = "") => {
    return Notify.warning(_msg ? _msg : "Warning");
  },
  info: (_msg = "") => {
    return Notify.info(_msg ? _msg : "Info");
  },
  error: (_msg = "") => {
    return Notify.failure(_msg ? _msg : "Error");
  },
  confirmAction: (
    _title = null,
    _text = null,
    _confirmBtnText = null,
    _denyBtnText = null
  ) => {
    return new Promise((resolve) => {
      Confirm.show(
        _title ? _title : "Are you sure!",
        _text ? _text : "Want to perform this action?",
        _confirmBtnText ? _confirmBtnText : "Yes",
        _denyBtnText ? _denyBtnText : "No",
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        },
        {
          titleColor: "#0b243f",
          okButtonBackground: "#0b243f",
          messageMaxLength: 1000,
        }
      );
    });
  },
};
