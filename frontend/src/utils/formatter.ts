export function formatHashFromNonZero(hash: string): string {
  return formatHash(hash.replace(/0x[0]*/, 'xdc'));
}

export function formatHash(hash: string): string {
  if (hash?.length >= 15) {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  }
  return hash;
}

export function formatMoney(money: number) {
  const abbreTable = [{
    name: 'Septillion', pow: 24,
  }, {
    name: 'Sextillion', pow: 21,
  }, {
    name: 'Quintillion', pow: 18,
  }, {
    name: 'Quadrillion', pow: 15,
  }, {
    name: 'Trillion', pow: 12,
  }, {
    name: 'B', pow: 9,
  }, {
    name: 'M', pow: 6,
  }, {
    name: 'K', pow: 3,
  }];

  for (let i = 0; i < abbreTable.length; i++) {
    const { name, pow } = abbreTable[i];
    const base = Math.pow(10, pow);

    if ((money / base) > 1) {
      return `${Math.floor(((money / base) * 100)) / 100} ${name}`;
    }
  }

  return money;
}

export function formatTime(unixTimestamp: number) {
  const date = new Date(unixTimestamp * 1000);

  const formattedDate = date.toLocaleString();

  return formattedDate;
}