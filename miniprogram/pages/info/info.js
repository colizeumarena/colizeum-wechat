// info.js
Page({
  data: {
    selectedZone: 0,
    selectedHardware: 0,
    prices: [
      // 普通区
      {
        weekday: {
          night: { price: 17 },
          day: { hour1: 3.5, hour3: 8, hour5: 13.5 },
        },
        weekend: {
          night: { price: 19.5 },
          day: { hour1: 4, hour3: 10.5, hour5: 16 },
        },
      },
      // 专业区
      {
        weekday: {
          night: { price: 19.5 },
          day: { hour1: 4.5, hour3: 11, hour5: 16 },
        },
        weekend: {
          night: { price: 21.5 },
          day: { hour1: 5, hour3: 13, hour5: 18 },
        },
      },
      // 租赁电视 65"
      {
        weekday: {
          night: { price: 16 },
          day: { hour1: 3.5, hour3: 9, hour5: 14 },
        },
        weekend: {
          night: { price: 18 },
          day: { hour1: 4, hour3: 10, hour5: 15 },
        },
      },
      // 租赁贵宾电视 85"
      {
        weekday: {
          night: { price: 17.5 },
          day: { hour1: 5, hour3: 10.5, hour5: 15.5 },
        },
        weekend: {
          night: { price: 19.5 },
          day: { hour1: 5.5, hour3: 11.5, hour5: 16.5 },
        },
      },
    ],
    hardware: [
      // 标准
      {
        pc: {
          cpu: "i5-13400F",
          gpu: "4060",
          ram: "32Gb DDR5",
        },
        peripherals: {
          monitor: 'ASUS 24"/27" 240Hz',
          mouse: "ASUS TUF M3",
          headset: "ASUS TUF H3",
          keyboard: "ASUS ROG STRIX NX",
        },
      },
      // 训练营
      {
        pc: {
          cpu: "i5-13400F",
          gpu: "4070",
          ram: "32Gb DDR5",
        },
        peripherals: {
          monitor: 'ASUS 27" 270Hz',
          mouse: "ASUS GLADIUS II",
          headset: "ASUS ROG DELTA",
          keyboard: "ASUS ROG STRIX SCOPE NX",
        },
      },
    ],
  },

  switchZone(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      selectedZone: index,
    });
  },

  switchHardware(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      selectedHardware: index,
    });
  },

  onLoad() {},
});
