export const REQUIRED_PROFILE_PERCENT = 70;

const isFilled = (value) => {
  if (Array.isArray(value)) return value.some((v) => String(v ?? '').trim() !== '');
  return value !== null && value !== undefined && String(value).trim() !== '';
};

export const liveCompletion = (completion, profileData) => {
  if (!completion?.fields?.length) return completion;

  let percent = 0;
  const missing = [];
  const fields = completion.fields.map((field) => {
    const done = isFilled(profileData[field.key]);
    if (done) percent += field.weight;
    else missing.push(field.label);
    return { ...field, done };
  });

  const required = completion.required ?? REQUIRED_PROFILE_PERCENT;
  return { ...completion, percent, missing, fields, eligible: percent >= required };
};
