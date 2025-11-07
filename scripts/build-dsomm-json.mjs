import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const ROOT = path.resolve(process.cwd());
const GENERATED = path.join(
  ROOT,
  'vendor/DevSecOps-MaturityModel-data/src/assets/YAML/generated/generated.yaml'
);
const OUT_FILE = path.join(ROOT, 'data/dsomm-devsecops.json');

function readYaml(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  return yaml.load(text);
}

function collectModelFromGenerated(doc) {
  // doc structure: { Domain: { Subdimension: { ActivityName: { uuid, level, description, risk, measure, ... } } } }
  const domains = Object.entries(doc).map(([domainName, subdimensions]) => {
    const practices = Object.entries(subdimensions).map(([subName, activities]) => {
      const items = Object.entries(activities).map(([activityName, detail]) => ({
        id: detail.uuid || `${subName}:${activityName}`,
        name: activityName,
        level: Number(detail.level) || 0,
        description: (detail.description || '').toString().trim(),
        risk: (detail.risk || '').toString().trim(),
        measure: (detail.measure || '').toString().trim(),
        implementationGuide: detail.meta?.implementationGuide || '',
        difficulty: detail.difficultyOfImplementation || {},
        tags: detail.tags || [],
        references: detail.references || {},
      }));
      const levels = [1, 2, 3, 4, 5].map(lvl => ({
        level: lvl,
        activities: items
          .filter(it => it.level === lvl)
          .map(({ id, name, description, risk, measure, implementationGuide, difficulty, tags, references }) => ({
            id,
            name,
            description,
            risk,
            measure,
            implementationGuide,
            difficulty,
            tags,
            references,
          })),
      }));
      return { id: `${domainName}:${subName}`, name: subName, levels };
    });
    return { id: domainName.toLowerCase().replace(/\s+/g, '-'), name: domainName, practices };
  });
  return { version: 'devsecops-dsomm-1.0', domains };
}

function main() {
  const doc = readYaml(GENERATED);
  const model = collectModelFromGenerated(doc);
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(model, null, 2), 'utf8');
  console.log(`Wrote ${OUT_FILE}`);
}

main();


